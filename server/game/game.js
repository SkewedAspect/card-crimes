//----------------------------------------------------------------------------------------------------------------------
// Brief description for game.js module.
//
// @module game.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var uuid = require('node-uuid');
var Promise = require('bluebird');

var api = require('../api');
var errors = require('../errors');

//----------------------------------------------------------------------------------------------------------------------

function drawRandom(deck)
{
    var index = Math.floor(deck.length * Math.random());
    return deck.splice(index, 1)[0];
} // drawRandom

//----------------------------------------------------------------------------------------------------------------------

function Game(name, creator)
{
    this.name = name;
    this.id = uuid.v4();
    this.state = 'initial';
    this.creator = creator;

    // The current list of players in the game
    this.players = [];

    // Automatically add the creator to the game
    this.players.push(creator);

    // The current list of spectators in the game
    this.spectators = [];

    // This is stored in a way that makes it easy to add/remove decks
    this.decks = {};

    // These are generated when the game starts, or we run out of cards
    this.calls = [];
    this.responses = [];

    // Changed every round
    this.currentJudge = undefined;
    this.currentCall = undefined;
    this.submittedResponses = [];
} // end Game

Game.prototype = {
    get humanPlayers()
    {
        var PlayerClient = require('../clients/player');
        return _.filter(this.players, function(player)
        {
            return player instanceof PlayerClient;
        });
    },
    get enoughPlayers(){ return this.humanPlayers.length > 1; }
};

//----------------------------------------------------------------------------------------------------------------------
// Internal API
//----------------------------------------------------------------------------------------------------------------------

Game.prototype._buildDeck = function()
{
    var self = this;
    this.calls = [];
    this.responses = [];

    _.forIn(this.decks, function(value)
    {
        self.calls = self.calls.concat(value.calls);
        self.responses = self.responses.concat(value.responses);
    });
}; // end _buildDeck

Game.prototype._checkResponses = function()
{
    var numPlayers = this.players.length - 1;
    return numPlayers == _.keys(this.submittedResponses).length;
}; // end _checkResponses

Game.prototype._checkState = function(validStates, action)
{
    if(!_.isArray(validStates))
    {
        validStates = [validStates];
    } // end if

    if(validStates.indexOf(this.state) != -1)
    {
        return Promise.resolve();
    }
    else
    {
        return Promise.reject(new errors.InvalidStateError(this.state, action));
    } // end if
}; // end checkState

Game.prototype._newRound = function()
{
    var PlayerClient = require('../clients/player');
    var self = this;

    // Ensure we're in the right state
    if(this.state != 'new round')
    {
        this.state = 'new round';
    } // end if

    // Select the next judge
    var nextJudgeIndex = 0;
    var judgeFound = false;
    var offset = 0;

    while(!judgeFound)
    {
        // Increment offset
        offset++;

        // Figure out the next judge index
        if(this.currentJudge)
        {
                // Get the next possible judge
                nextJudgeIndex = this.players.indexOf(this.currentJudge) + offset;
                if(nextJudgeIndex == 0 || nextJudgeIndex >= this.players.length)
                {
                    // In the event that nextJudgeIndex == 0, it means we didn't find the current judge in our list of
                    // players. This is an unexpected condition, so to handle it gracefully, we simply start over at the
                    // beginning of the players.

                    // If, instead, we run off the list, we circle around to the beginning.

                    nextJudgeIndex = 0;
                } // end if
        } // end if

        // Check to make sure this is a player, not an AI.
        if(this.players[nextJudgeIndex] instanceof PlayerClient)
        {
            judgeFound = true;
        } // end if
    } // end while

    // Set the current judge.
    this.currentJudge = this.players[nextJudgeIndex];

    // Draw the new call
    this._drawCall()
        .then(function(call)
        {
            self.state = 'waiting';
            self.currentCall = call;
            self._broadcast('next round', { judge: self.currentJudge.id, call: call });
        });
}; // end _newRound

Game.prototype._drawCall = function()
{
    return Promise.resolve(drawRandom(this.calls));
}; // end _drawCall

Game.prototype._broadcast = function(type, payload, skipClient)
{
    skipClient = skipClient || {};

    // Broadcast to players
    _.forEach(this.players, function(player)
    {
        if(player.id != skipClient.id && player.socket)
        {
            player.socket.emit(type, payload);
        } // end if
    });

    // Broadcast to spectators
    _.forEach(this.spectators, function(spectator)
    {
        if(spectator.id != skipClient.id && spectator.socket)
        {
            spectator.socket.emit(type, payload);
        } // end if
    });
}; // end _broadcast

//----------------------------------------------------------------------------------------------------------------------
// Public API
//----------------------------------------------------------------------------------------------------------------------

/**
 * Starts the game.
 *
 * @returns {Promise} Returns a promise that is always resolved.
 */
Game.prototype.start = function()
{
    if(this.enoughPlayers && _.keys(this.decks).length > 0)
    {
        // We assume the creator is the person starting the game.
        this._broadcast('game started', undefined, this.creator);

        // Set the state to be 'new round'.
        this.state = 'new round';

        // We build our deck from the previously selected Cardcast decks.
        this._buildDeck();

        // Schedule the start of the new round for the next tick.
        setImmediate(this._newRound.bind(this));

        return Promise.resolve();
    }
    else if(_.keys(this.decks).length == 0)
    {
        return Promise.reject(new Error("Cannot start a game without at least one deck."));
    }
    else
    {
        return Promise.reject(new Error("Not enough players."));
    } // end if
}; // end start

/**
 * Renames the game.
 *
 * @param {string} name - The name to rename the game to.
 * @returns {Promise} Returns a promise that is always resolved.
 */
Game.prototype.rename = function(name)
{
    var self = this;
    return this._checkState('initial', 'rename()')
        .then(function()
        {
            self.name = name;

            // We assume the creator is the person doing the rename.
            self._broadcast('game renamed', { name: name }, self.creator);
        });
}; // end rename

/**
 * Adds a player to the game.
 *
 * @param {PlayerClient} client - The client object representing the player who just joined.
 * @returns {Promise} Returns a promise that is always resolved.
 */
Game.prototype.join = function(client)
{
    this.players.push(client);
    this._broadcast('player joined', { player: client }, client);

    return Promise.resolve();
}; // end join

/**
 * Removes a player from the game.
 *
 * @param {PlayerClient} client - The client object representing the player who just left.
 * @returns {Promise} Returns a promise that is always resolved.
 */
Game.prototype.leave = function(client)
{
    _.remove(this.players, { id: client.id });
    this._broadcast('player left', { player: client.id }, client);

    // Check to see if we should pause the game
    if(!this.enoughPlayers && this.state != 'initial')
    {
        this.state = 'paused';
        this._broadcast('game paused');
    } // end if

    return Promise.resolve();
}; // end leave

/**
 * Adds a spectator to the game.
 *
 * @param {PlayerClient} client - The client object representing the spectator who just joined.
 * @returns {Promise} Returns a promise that is always resolved.
 */
Game.prototype.spectatorJoin = function(client)
{
    this.spectators.push(client);
    this._broadcast('spectator joined', { spectator: client }, client);

    return Promise.resolve();
}; // end spectatorJoin

/**
 * Removes a spectator from the game.
 *
 * @param {PlayerClient} client - The client object representing the spectator who just left.
 * @returns {Promise} Returns a promise that is always resolved.
 */
Game.prototype.spectatorLeave = function(client)
{
    _.remove(this.spectators, { id: client.id });
    this._broadcast('spectator left', { spectator: client.id }, client);

    return Promise.resolve();
}; // end spectatorLeave

/**
 * Add a random AI player to the game. Random players will generate their responses at random, and submit them.
 *
 * @param {string} [name] - The name of the Random player.
 * @returns {Promise} Returns a promise that is always resolved.
 */
Game.prototype.addRandomPlayer = function(name)
{
    var RandomClient = require('../clients/random');

    // Default the name
    name = name || "Rando Cardrissian";

    // Build the client object
    var client = new RandomClient(name);
    this.players.push(client);

    // Inform players that a 'new player' has joined
    this._broadcast('player joined', { player: client }, client);

    return Promise.resolve();
}; // end addRandomPlayer

/**
 * Adds a deck to the game. This is only usable while the game is in the `'initial'` state.
 *
 * @param {string} playCode - The Cardcast play code of the deck to add.
 * @returns {Promise} Returns a promise that is resolved if the deck was successfully added.
 */
Game.prototype.addDeck = function(playCode)
{
    var self = this;
    return this._checkState('initial', 'addDeck()')
        .then(function()
        {
            return api.deck(playCode)
                .then(function(deck)
                {
                    self.decks[playCode] = deck;
                });
        });
}; // end addDeck

/**
 * Removes a deck from the game. This is only usable while the game is in the `'initial'` state.
 *
 * @param {string} playCode - The Cardcast play code of the deck to remove.
 * @returns {Promise} Returns a promise that is resolved if the deck was successfully removed.
 */
Game.prototype.removeDeck = function(playCode)
{
    var self = this;
    return this._checkState('initial', 'removeDeck()')
        .then(function()
        {
            delete self.decks[playCode];
        });
}; // end removeDeck

/**
 * Draws a single, random response, removing it from the list of cards able to the drawn.
 *
 * @returns {Promise} Returns a Promise that is resolved to the response card object.
 */
Game.prototype.drawResponse = function()
{
    return Promise.resolve(drawRandom(this.responses));
}; // end drawResponse

/**
 * Submits a response (or array of responses) to be judged.
 *
 * @param {PlayerClient} player - The Client object representing the player who submitted the response.
 * @param {string|string[]} cardIDs - The ID of the cards submitted in the response. If an array, order is important;
 * the blanks will be filled in the order they appear.
 * @returns {Promise} Returns a Promise that is resolved with the new id of the submitted response.
 */
Game.prototype.submitResponse = function(player, cardIDs)
{
    var self = this;
    return this._checkState('waiting', 'submitResponse()')
        .then(function()
        {
            // Ensure that it's always an array.
            if(!_.isArray(cardIDs))
            {
                cardIDs = [cardIDs];
            } // end if

            // Create a new Response object
            var response = {
                id: uuid.v4(),
                player: player,
                cards: cardIDs
            };

            // Add the submitted response
            self.submittedResponses[response.id] = response;

            // Inform other players that this player has submitted their response.
            self._broadcast('response submitted', { player: player.id }, player);

            // We check the responses, to see if we should change state.
            if(self._checkResponses())
            {
                self.state = 'judging';
                self._broadcast('all responses submitted');
            } // end if

            // Return the response id
            return response.id;
        });
}; // end submitResponse

/**
 * Dismisses a response from consideration. This is only callable by the current judge.
 *
 * @param {string} responseID - The id of the response to dismiss (as was returned from `submitResponse()`).
 * @returns {Promise} Returns a promise that is resolved if the dismissal works.
 */
Game.prototype.dismissResponse = function(responseID)
{
    var self = this;
    return this._checkState('judging', 'dismissResponse()')
        .then(function()
        {
            // Get the dismissed response
            var response = self.submittedResponses[responseID];

            // Remove the dismissed response from submittedResponses.
            delete self.submittedResponses[responseID];

            // Tell the players of the dismissal.
            self._broadcast('dismissed response', { response: responseID, player: response.player }, self.currentJudge);
        });
}; // end dismissResponse

/**
 * Selects a response as the winning response.
 *
 * @param {string} responseID - The id of the response to select (as was returned from `submitResponse()`).
 * @returns {Promise} Returns a promise that is resolved if the selection works.
 */
Game.prototype.selectResponse = function(responseID)
{
    var self = this;
    return this._checkState('judging', 'dismissResponse()')
        .then(function()
        {
            self._broadcast('selected response', { response: self.submittedResponses[responseID] }, self.currentJudge);

            // Set the state to be 'new round'.
            self.state = 'new round';

            // Schedule the start of the new round for the next tick.
            setImmediate(self._newRound.bind(self));

            return Promise.resolve();
        });
}; // end selectResponse

/**
 * Converts the Game object into a simple object that can be easily converted to JSON.
 *
 * @returns {{id: string, name: string, state: string, players: PlayerClient[], spectators: PlayerClient[], currentCall: Card, currentJudge: PlayerClient, submittedResponses: []}}
 */
Game.prototype.toJSON = function()
{
    return {
        id: this.id,
        name: this.name,
        state: this.state,
        players: this.players,
        spectators: this.spectators,
        currentCall: this.currentCall,
        currentJudge: this.currentJudge,
        submittedResponses: this.submittedResponses
    }
}; // end toJSON

//----------------------------------------------------------------------------------------------------------------------

module.exports = Game;

//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
// Brief description for game.js module.
//
// @module game.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var shortId = require('shortid');
var Promise = require('bluebird');

var api = require('../api');
var errors = require('../errors');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

function drawRandom(deck)
{
    if(!_.isArray(deck))
    {
        logger.error("Deck is invalid! This should never happen!");
    } // end if

    if(_.isEmpty(deck))
    {
        return undefined;
    } // end if

    var index = Math.floor(deck.length * Math.random());
    return deck.splice(index, 1)[0];
} // drawRandom

//----------------------------------------------------------------------------------------------------------------------

function Game(name, creator)
{
    this.name = name;
    this.id = shortId.generate();
    this.created = new Date();
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
    this.submittedResponses = {};
} // end Game

Game.prototype = {
    get humanPlayers()
    {
        return _.filter(this.players, function(player)
        {
            return player.type != 'bot';
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

    // Ensure that the deck is compacted
    this.calls = _.compact(this.calls);
    this.responses = _.compact(this.responses);

    // Store unmodified copies
    this.totalCalls = this.calls.slice(0);
    this.totalResponses = this.responses.slice(0);
}; // end _buildDeck

Game.prototype._sanitizeSubmittedResponses = function()
{
    var self = this;
    return _.transform(this.submittedResponses, function(result, response, id)
    {
        var cards = _.reduce(response.cards, function(results, cardID)
        {
            results.push(_.find(self.totalResponses, { id: cardID }));
            return results;
        }, []);

        result[id] = {
            id: id,
            cards: cards,
            player: response.player.id
        };
    });
}; // end _sanitizeSubmittedResponses

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
        return Promise.reject(new errors.InvalidState(this.state, action));
    } // end if
}; // end checkState

Game.prototype._newRound = function()
{
    var self = this;

    // Ensure we're in the right state
    if(this.state != 'new round')
    {
        this.state = 'new round';
    } // end if

    // Clean out any submitted responses from the last round
    this.submittedResponses = {};

    // Start with the first human
    var nextJudgeIndex = 0;

    // Get the index of the next judge
    if(this.currentJudge)
    {
        nextJudgeIndex = _.findIndex(this.humanPlayers, { id: this.currentJudge.id }) + 1;

        // Loop around if we're over the size of our human players
        nextJudgeIndex = nextJudgeIndex >= this.humanPlayers.length ? 0 : nextJudgeIndex;
    } // end if

    // Set the current judge.
    this.currentJudge = this.humanPlayers[nextJudgeIndex];

    // Draw the new call
    this._drawCall()
        .then(function(call)
        {
            self.state = 'waiting';
            self.currentCall = call;
            self._broadcast('next round', { judge: self.currentJudge.id, call: call });
        })
        .then(function()
        {
            // Check to see if we should pause the game
            if(!self.enoughPlayers)
            {
                self.state = 'paused';
                self._broadcast('game paused');
            } // end if
        });
}; // end _newRound

Game.prototype._drawCall = function()
{
    if(this.calls.length == 0)
    {
        this.calls = this.totalCalls.slice(0);
    } // end if

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
    if(_.keys(this.decks).length > 0)
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
    // Reset the client's score
    client.score = 0;

    // Check for existing player
    var player = _.find(this.players, { id: client.id });

    // If the player doesn't already exist...
    if(!player)
    {
        this.players.push(client);
        this._broadcast('player joined', { player: client }, client);

        // If our player is currently added as a spectator, remove them
        _.remove(this.spectators, { id: client.id });

        // Check to see if we should unpause the game
        if(this.state == 'paused' && this.enoughPlayers)
        {
            // Figure out which state we should be in
            if(this._checkResponses())
            {
                this.state = 'judging';

                self._broadcast('all responses submitted', { responses: self._sanitizeSubmittedResponses() });
            }
            else if(this.currentCall && this.currentJudge)
            {
                this.state = 'waiting'
            }
            else
            {
                // Not sure how we got here, so let's just start a new round.
                logger.warn("Couldn't determine the next state.");
                this.state = 'next round';

                // Schedule the start of the new round for the next tick.
                setImmediate(this._newRound.bind(this));
            } // end if

            this._broadcast('game unpaused', {state: this.state});
        } // end if

        return Promise.resolve();
    }
    else
    {
        logger.warn("Player attempting to join game they are already participating in.");
        return Promise.reject(new errors.AlreadyPlayer(this));
    } // end if
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
    // Check for existing player
    var player = _.find(this.players, { id: client.id });

    // If the player doesn't already exist...
    if(!player)
    {
        // Check for existing spectator
        var spectator = _.find(this.spectators, { id: client.id });

        // If the spectator doesn't already exist...
        if(!spectator)
        {
            this.spectators.push(client);
            this._broadcast('spectator joined', {spectator: client}, client);

            return Promise.resolve();
        }
        else
        {
            logger.warn("Spectator attempting to join game they are already watching.");
            return Promise.reject(new Error("Spectator attempting to join game they are already watching."));
        } // end if
    }
    else
    {
        return Promise.reject(new errors.AlreadyPlayer(this));
    } // end if
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
 * @param {string} [name] - The name of the Random player to add.
 * @returns {Promise} Returns a promise that is always resolved.
 */
Game.prototype.addRandomPlayer = function(name)
{
    var RandomClient = require('../clients/random');

    // Default the name
    name = name || "Rando Cardrissian";

    // Build the client object
    var client = new RandomClient(name, this);
    this.players.push(client);

    // Inform players that a 'new player' has joined
    this._broadcast('player joined', { player: client }, client);

    return Promise.resolve(client);
}; // end addRandomPlayer

/**
 * Remove a random AI player from the game.
 *
 * @param {string} id - The id of the Random player to remove.
 * @returns {Promise} Returns a promise that is always resolved.
 */
Game.prototype.removeRandomPlayer =  function(id)
{
    var RandomClient = require('../clients/random');
    var client = _.find(this.players, { id: id });

    if(client instanceof RandomClient)
    {
        this._broadcast('player left', { player: id }, client);

        _.remove(this.players, {id: id});

        return Promise.resolve();
    }
    else
    {
        return Promise.reject(new Error("Player with id '" + id + "' is not a bot!"));
    } // end if
}; // end removeRandomPlayer

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
                    return deck;
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
    if(this.responses.length == 0)
    {
        this.responses = this.totalResponses.slice(0);
    } // end if

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
    return this._checkState(['waiting', 'paused'], 'submitResponse()')
        .then(function()
        {
            // Ensure that it's always an array.
            if(!_.isArray(cardIDs))
            {
                cardIDs = [cardIDs];
            } // end if

            // Create a new Response object
            var response = {
                id: shortId.generate(),
                player: player,
                cards: cardIDs
            };

            // Add the submitted response
            self.submittedResponses[response.id] = response;

            // Inform other players that this player has submitted their response.
            self._broadcast('response submitted', {
                    response: response.id,
                    responses: self._sanitizeSubmittedResponses(),
                    player: player.id
                }, player);

            // We check the responses, to see if we should change state.
            if(self._checkResponses() && self.state != 'paused')
            {
                self.state = 'judging';

                self._broadcast('all responses submitted', { responses: self._sanitizeSubmittedResponses() });
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

            // Remove the dismissed response from submittedResponses
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
    return this._checkState('judging', 'selectResponse()')
        .then(function()
        {
            var response = self.submittedResponses[responseID];
            response.player.score += 1;

            self._broadcast('selected response', {
                    response: {
                        id: response.id,
                        player: response.player
                    }
                });

            // Set the state to be 'new round'
            self.state = 'new round';

            // Schedule the start of the new round for the next tick
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
    var decks = _.transform(this.decks, function(result, deck, code)
    {
        result[code] = {
            name: deck.name,
            code: deck.code,
            rating: deck.rating,
            author: {
                id: deck.author.id,
                username: deck.author.username
            },
            call_count: deck.call_count,
            response_count: deck.response_count
        }
    });

    var submittedResponses = this._sanitizeSubmittedResponses();

    return {
        id: this.id,
        name: this.name,
        decks: decks,
        state: this.state,
        created: this.created,
        players: this.players,
        spectators: this.spectators,
        currentCall: this.currentCall,
        currentJudge: this.currentJudge,
        submittedResponses: submittedResponses
    }
}; // end toJSON

//----------------------------------------------------------------------------------------------------------------------

module.exports = Game;

//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
// Brief description for game.js module.
//
// @module game.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var shortId = require('shortid');
var Promise = require('bluebird');

var clientMgr = require('../clients/clientMgr');
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

function Game(name, options, decks)
{
    var self = this;

    this.name = name;
    this.options = options;
    this.id = shortId.generate();
    this.created = new Date();
    this._state = 'initial';

    // The channel we broadcast our game events over
    this.channel = clientMgr.io.of('games');

    // The current list of players in the game
    this.players = {};

    // Add bots
    _.each(options.bots, this._addBot.bind(this));

    // These are generated when the game starts, or we run out of cards
    this.calls = [];
    this.responses = [];

    // This is our source set of decks
    this.decks = {};

    // Changed every round
    this.judge = undefined;
    this.call = undefined;
    this.submittedResponses = {};

    // Check to make sure we have enough decks
    if(!_.isArray(decks) &&_.isEmpty(decks))
    {
        throw new Error("Can't start a game without at least one deck!");
    } // end if

    // Populate our list of source decks
    Promise.resolve(decks)
        .each(function(playCode) { return self._addDeck(playCode); })
        .then(function()
        {
            // Build our decks list
            self._buildDeck();

            // Start a new round
            self._newRound();
        });
} // end Game

Game.prototype = {
    get humanPlayers(){ return _.filter(this.players, function(player){ return player.type != 'bot'; }); },
    get botPlayers(){ return _.filter(this.players, function(player){ return player.type == 'bot'; }); },
    get enoughPlayers(){ return this.humanPlayers.length > 1; },
    get maxPlayers(){ return Math.floor(this.totalResponses / 10); },
    get room(){ return this.channel.to(this.id); },
    get state(){ return this._state; },
    set state(val) { this._state = val; this._broadcast(val); }
};

//----------------------------------------------------------------------------------------------------------------------
// Internal API
//----------------------------------------------------------------------------------------------------------------------

Game.prototype._bindEventHandlers = function(client)
{
    client.socket.on('leave game', this._handleLeaveGame.bind(this, client));
    client.socket.on('submit response', this._handleSubmitResponse.bind(this, client));
    client.socket.on('dismiss response', this._handleDismissResponse.bind(this, client));
    client.socket.on('select response', this._handleSelectResponse.bind(this, client));
}; // end _bindEventHandler

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

Game.prototype._addDeck = function(playCode)
{
    var self = this;
    return api.deck(playCode)
        .then(function(deck)
        {
            self.decks[playCode] = deck;
            return deck;
        });
}; // end _addDeck

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
    var numPlayers = _.keys(this.players).length - 1;
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

Game.prototype._nextJudge = function()
{
    // Start with the first human
    var nextJudgeIndex = 0;

    // Get the index of the next judge
    if(this.judge)
    {
        nextJudgeIndex = _.findIndex(this.humanPlayers, { id: this.judge.id }) + 1;

        // Loop around if we're over the size of our human players
        nextJudgeIndex = nextJudgeIndex >= this.humanPlayers.length ? 0 : nextJudgeIndex;
    } // end if

    // Return the next judge
    return this.humanPlayers[nextJudgeIndex].client;
}; // end _nextJudge

Game.prototype._addBot = function(name)
{
    var RandomBot = require('../clients/random');

    // Default the name
    name = name || "Rando Cardrissian";

    // Build the client object
    var client = new RandomBot(name, this);
    this.players[client.id] = client;

    // Inform players that a 'new player' has joined
    this._broadcast('player joined', { player: client }, client);

    return Promise.resolve(client);
}; // end _addBot

Game.prototype._newRound = function()
{
    var self = this;

    // Check to see if we're in a valid state to start a round
    if(!this.enoughPlayers)
    {
        this.state = 'paused';
    }
    else
    {
        // Ensure we're in the right state
        if(this.state != 'new round')
        {
            this.state = 'new round';
        } // end if

        // Clean out any submitted responses from the last round
        this.submittedResponses = {};

        // Set the current judge.
        this.judge = this._nextJudge();

        // Draw the new call
        this._drawCall()
            .then(function(call)
            {
                self.call = call;
                self.state = 'waiting';
                self._broadcast('round start', { judge: self.judge.id, call: call });
            });
    } // end if
}; // end _newRound

Game.prototype._drawCall = function()
{
    if(this.calls.length == 0)
    {
        this.calls = this.totalCalls.slice(0);
    } // end if

    return Promise.resolve(drawRandom(this.calls));
}; // end _drawCall

Game.prototype._drawResponse = function()
{
    // Check to see if we need to shuffle the discard pile
    if(this.responses.length == 0)
    {
        // Reset our list of possible responses, filtering out those responses that are currently in other players'
        // hands.
        this.responses = _.reduce(this.totalResponses.slice(0), function(results, response)
        {
            var found  = false;
            _.forIn(self.players, function(session)
            {
                found = _.some(session.hand, 'id', response.id);
            });

            if(!found)
            {
                results.push(repsonse);
            } // end if

            return results;
        });
    } // end if

    return Promise.resolve(drawRandom(this.calls));
}; // end _drawResponse

Game.prototype._drawUp = function(player)
{
    var self = this;
    var numToDraw = 10 - player.hand.length;

    player.hand = _.reduce(_.range(numToDraw), function(hand)
    {
        hand.push(self._drawResponse());
        return hand;
    }, player.hand);

    // Tell the client about it's new hand
    player.client.socket.emit('hand', player.hand);
}; // end drawUp

Game.prototype._broadcast = function(type, payload)
{
    // Send over socket.io
    this.room.emit(type, payload);

    // Send to our bots
    _.each(this.botPlayers, function(bot)
    {
        bot.socket.emit(type, payload);
    });
}; // end _broadcast

//----------------------------------------------------------------------------------------------------------------------
// Event Handlers
//----------------------------------------------------------------------------------------------------------------------

Game.prototype._handleLeaveGame = function(client)
{
    this._broadcast('player left', { player: client });
    client.socket.removeAllListeners();
    delete this.players[client.id];

    // Check to see if we have enough players to keep playing
    if(!this.enoughPlayers)
    {
        this.state = 'paused';
    } // end if

    // Check to see if the player who left is the current judge
    if(this.judge.id = client.id)
    {
        var newJudge = this._nextJudge();

        // Remove the new judge's response.
        this.submittedResponses = _.transform(this.submittedResponses, function(result, response, responseID)
        {
            if(response.player.id != newJudge.id)
            {
                result[responseID] = response;
            } // end if
        });

        // Set the new judge
        this.judge = newJudge;

        // We need to tell the client about the chance in judge.
        this._broadcast('new judge', { judge: newJudge, responses: this._sanitizeSubmittedResponses() });

        // We check the responses, to see if we should change state.
        if(this._checkResponses() && this.state != 'paused' && this.state != 'judging')
        {
            this.state = 'judging';
            this._broadcast('all responses submitted', { responses: this._sanitizeSubmittedResponses() });
        } // end if
    } // end if
}; // end _handleLeaveGame

//TODO: We need to check to make sure that we're submitting the correct number of responses.
Game.prototype._handleSubmitResponse = function(client, cardIDs)
{
    var self = this;
    var session = this.players[client.id];
    this._checkState(['waiting', 'paused'], '_handleSubmitResponse()')
        .then(function()
        {
            // Ensure that it's always an array.
            cardIDs = [].concat(cardIDs);

            // Remove the responses from our player's hand
            _.each(cardIDs, function(cardID)
            {
                _.remove(session.hand, { id: cardID});
            });

            // Create a new Response object
            var response = {
                id: shortId.generate(),
                player: client,
                cards: cardIDs
            };

            // Add the submitted response
            self.submittedResponses[response.id] = response;

            // Inform other clients that this client has submitted their response.
            self._broadcast('response submitted', {
                response: response.id,
                responses: self._sanitizeSubmittedResponses(),
                player: client.id
            }, client);

            // Draw back up to 10 cards in the player's hand
            self._drawUp(session);

            // We check the responses, to see if we should change state.
            if(self._checkResponses() && self.state != 'paused')
            {
                self.state = 'judging';
                self._broadcast('all responses submitted', { responses: self._sanitizeSubmittedResponses() });
            } // end if
        });
}; // end _handleSubmitResponse

Game.prototype._handleDismissResponse = function(client, responseID)
{
    var self = this;
    this._checkState('judging', '_handleDismissResponse()')
        .then(function()
        {
            if(client.id == self.judge.id)
            {
                // Get the dismissed response
                var response = self.submittedResponses[responseID];

                // Remove the dismissed response from submittedResponses
                delete self.submittedResponses[responseID];

                // Tell the players of the dismissal.
                self._broadcast('dismissed response', { response: responseID, player: response.player }, self.judge);
            }
            else
            {
                logger.warn("Client '%s' attempted to dismiss a response.", client.id);
            } // end if
        });
}; // end _handleDismissResponse

Game.prototype._handleSelectResponse = function(client, responseID)
{
    var self = this;
    this._checkState('judging', '_handleSelectResponse()')
        .then(function()
        {
            if(client.id == self.judge.id)
            {
                var response = self.submittedResponses[responseID];
                self.players[response.player.id].score += 1;

                self._broadcast('selected response', {
                    response: {
                        id: response.id,
                        player: response.player
                    }
                });

                // Schedule the start of the new round for the next tick
               setImmediate(self._newRound.bind(self));
            }
            else
            {
                logger.warn("Client '%s' attempted to select a response.", client.id);
            } // end if
        });
}; // end _handleSelectResponse

//----------------------------------------------------------------------------------------------------------------------
// Public API
//----------------------------------------------------------------------------------------------------------------------

/**
 * Adds a player to the game.
 *
 * @param {PlayerClient} client - The client object representing the player who just joined.
 * @returns {Promise} Returns a promise that is always resolved.
 */
Game.prototype.join = function(client)
{
    // Connect up the socket.io calls to client.socket
    this._bindEventHandlers(client);

    // Check for reconnecting player
    var session = this.players[client.id];

    if(!session)
    {
        session = {
            score: 0,
            client: client,
            hand:[]
        };

        this.players[client.id] = session;
    }
    else
    {
        session.client = client;
    } // end if

    // Draw up to 10 cards for our hand
    this._drawUp(session);

    // We inform other players that a new player's joined.
    this._broadcast('player joined', { player: client, score: session.score });

    // Check to see if we should unpause the game
    if(this.state == 'paused' && this.enoughPlayers)
    {
        // Figure out which state we should be in
        if(this._checkResponses())
        {
            this.state = 'judging';

            self._broadcast('all responses submitted', { responses: self._sanitizeSubmittedResponses() });
        }
        else if(this.call && this.judge)
        {
            this.state = 'waiting'
        }
        else
        {
            this.state = 'new round';

            // Schedule the start of the new round for the next tick.
            setImmediate(this._newRound.bind(this));
        } // end if
    } // end if
}; // end join

/**
 * Converts the Game object into a simple object that can be easily converted to JSON.
 *
 * @returns {{id: string, name: string, state: string, players: PlayerClient[], spectators: PlayerClient[], call: Card, judge: PlayerClient, submittedResponses: []}}
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
        call: this.call,
        judge: this.judge,
        state: this.state,
        created: this.created,
        players: this.players,
        maxPlayers: this.maxPlayers,
        spectators: this.spectators,
        submittedResponses: submittedResponses
    }
}; // end toJSON

//----------------------------------------------------------------------------------------------------------------------

module.exports = Game;

//----------------------------------------------------------------------------------------------------------------------
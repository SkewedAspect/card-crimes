//----------------------------------------------------------------------------------------------------------------------
// Represents the client's connection to the game server
//
// @module client.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var shortId = require('shortid');
var Promise = require('bluebird');

var api = require('../api');
var errors = require('../errors');
var gameManager = require('../game/manager');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

function PlayerClient(socket)
{
    this.id = shortId.generate();
    this.secret = shortId.generate();
    this.name = 'Player-' + this.id;
    this.socket = socket;

    // This is the player's current score
    this.score = 0;

    this._bindEventHandlers();
} // end GameClient

PlayerClient.prototype._bindEventHandlers = function()
{
    // Socket.io
    this.socket.on('disconnect', this._bindEventHandler(this._handleDisconnect));

    // Client API
    this.socket.on('client rename', this._bindEventHandler(this._handleClientRename));

    // Game API
    this.socket.on('list games', this._bindEventHandler(this._handleListGames));
    this.socket.on('new game', this._bindEventHandler(this._handleCreateGame));
    this.socket.on('start game', this._bindEventHandler(this._handleStartGame));
    this.socket.on('add bot', this._bindEventHandler(this._handleAddBot));
    this.socket.on('remove bot', this._bindEventHandler(this._handleRemoveBot));
    this.socket.on('join game', this._bindEventHandler(this._handleJoinGame));
    this.socket.on('leave game', this._bindEventHandler(this._handleLeaveGame));
    this.socket.on('draw card', this._bindEventHandler(this._handleDrawCard));
    this.socket.on('submit cards', this._bindEventHandler(this._handleSubmitCards));
    this.socket.on('dismiss response', this._bindEventHandler(this._handleDismissResponse));
    this.socket.on('select response', this._bindEventHandler(this._handleSelectResponse));

    // Deck API
    this.socket.on('search decks', this._bindEventHandler(this._handleSearchDeck));
    this.socket.on('add deck', this._bindEventHandler(this._handleAddDeck));
    this.socket.on('remove deck', this._bindEventHandler(this._handleRemoveDeck));
}; // end _bindEventHandlers

//----------------------------------------------------------------------------------------------------------------------

PlayerClient.prototype._bindEventHandler = function(handler)
{
    var self = this;
    return function()
    {
        try
        {
            handler.apply(self, arguments)
        }
        catch(exp)
        {
            var respond = _.last(arguments);
            if(_.isFunction(respond))
            {
                logger.error('Unhandled Exception:\n', exp.stack);

                respond({
                    confirm: false,
                    reason: 'unhandled-exception',
                    message: exp.message,
                    stack: exp.stack
                });
            } // end if
        } // end try/catch
    }
}; // end _bindEventHandler

//----------------------------------------------------------------------------------------------------------------------
// Public API
//----------------------------------------------------------------------------------------------------------------------

PlayerClient.prototype.negotiateSecret = function(oldClient)
{
    var self = this;
    return new Promise(function(resolve)
    {
        // The client had a previous secret. We need to impersonate it.
        if(oldClient)
        {
            self.id = oldClient.id;

            // If the previous client were part of a game, we need to remove it, and re-insert ourselves.
            if(oldClient.game && oldClient.game.id == (self.game || {}).id)
            {
                self.score = oldClient.score;
                var game = oldClient.game;

                _.remove(game.players, { id: oldClient.id });
                game.players.push(self);

                if((game.currentJudge || {}).id == oldClient.id)
                {
                    game.currentJudge = self;
                } // end if

                // If the old client's disconnection timer is running, let's stop that.
                if(oldClient.disconnectTimeout)
                {
                    clearTimeout(oldClient.disconnectTimeout);
                    oldClient.disconnectTimeout = undefined;
                } // end if

                // Just for good measure
                oldClient.socket.removeAllListeners();
            } // end if
        } // end if

        resolve(self);
    });
}; // end negotiateSecret

//----------------------------------------------------------------------------------------------------------------------
// Event Handlers
//----------------------------------------------------------------------------------------------------------------------

PlayerClient.prototype._handleDisconnect = function()
{
    var self = this;
    var timeout = 2 * 60 * 1000; // 2 minutes
    this.disconnectTimeout = setTimeout(function()
    {
        if(self.game)
        {
            gameManager.leaveGame(self.game.id, self);
        } // end if
    }, timeout);
}; // end _handleDisconnect

PlayerClient.prototype._handleClientRename = function(name, respond)
{
    this.name = name;
    respond({
        confirm: true
    });
}; // end _handleClientRename

PlayerClient.prototype._handleListGames = function(respond)
{
    gameManager.listGames()
        .then(function(games)
        {
            respond({
                confirm: true,
                games: games
            });
        });
}; // end _handleListGames

PlayerClient.prototype._handleCreateGame = function(name, respond)
{
    var self = this;
    gameManager.newGame(name, this)
        .then(function(game)
        {
            // Store this game as ours
            self.game = game;

            respond({
                confirm: true,
                game: game
            });
        });
}; // end _handleCreateName

PlayerClient.prototype._handleSearchDeck = function(query, offset, respond)
{
    api.search(query, offset)
        .then(function(decks)
        {
            respond({
                confirm: true,
                decks: decks
            });
        });
}; // end _handleSearchDeck

PlayerClient.prototype._handleAddDeck = function(code, respond)
{
    this.game.addDeck(code)
        .then(function(deck)
        {
            respond({
                confirm: true,
                deck: {
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
        });
}; // end _handleAddDeck

PlayerClient.prototype._handleRemoveDeck = function(code, respond)
{
    this.game.removeDeck(code)
        .then(function()
        {
            respond({
                confirm: true
            });
        });
}; // end _handleRemoveDeck

PlayerClient.prototype._handleAddBot = function(name, respond)
{
    this.game.addRandomPlayer(name)
        .then(function(bot)
        {
            respond({
                confirm: true,
                bot: bot
            });
        });
}; // end _handleAddBot

PlayerClient.prototype._handleRemoveBot = function(id, respond)
{
    this.game.removeRandomPlayer(id)
        .then(function()
        {
            respond({
                confirm: true
            });
        })
        .catch(function(error)
        {
            respond({
                confirm: false,
                message: error.message
            });
        });
}; // end _handleRemoveBot

PlayerClient.prototype._handleStartGame = function(respond)
{
    this.game.start()
        .then(function()
        {
            respond({
                confirm: true
            });
        })
        .catch(function(error)
        {
            respond({
                confirm: false,
                message: error.message
            });
        });
}; // end _handleStartGame

PlayerClient.prototype._handleJoinGame = function(isPlayer, gameID, respond)
{
    var self = this;
    var joinPromise;

    if(isPlayer)
    {
        joinPromise = gameManager.joinGame(gameID, this);
    }
    else
    {
        joinPromise = gameManager.spectatorJoinGame(gameID, this);
    } // end if

    // Once we've joined, inform the client.
    joinPromise
        .then(function(game)
        {
            self.game = game;

            respond({
                confirm: true,
                game: game
            });
        })
        .catch(errors.AlreadyPlayer, function()
        {
            logger.warn('Attempting to join game when already a player. isPlayer:', isPlayer);

            respond({
                confirm: false,
                message: 'Attempting to join game when already a player.',
                reason: 'already-player'
            });
        })
        .catch(function(error)
        {
            logger.error('Encountered error joining game:\n', error.stack || error.message);

            respond({
                confirm: false,
                message: error.message
            });
        });
}; // end _handleJoinGame

PlayerClient.prototype._handleLeaveGame = function(gameID, respond)
{
    var self = this;
    gameManager.leaveGame(gameID, this)
        .then(function()
        {
            self.game = undefined;
            respond({
                confirm: true
            });
        })
        .catch(function(error)
        {
            logger.error("Error while leaving game:\n%s", error.stack || error.message);

            respond({
                confirm: false,
                message: error.message
            });
        });
}; // end _handleLeaveGame

PlayerClient.prototype._handleDrawCard = function(respond)
{
    this.game.drawResponse()
        .then(function(card)
        {
            respond({
                confirm: true,
                card: card
            })
        });
}; // end _handleDrawCard

PlayerClient.prototype._handleSubmitCards = function(cards, respond)
{
    var self = this;
    this.game.submitResponse(this, cards)
        .then(function(responseID)
        {
            respond({
                confirm: true,
                response: responseID,
                responses: self.game._sanitizeSubmittedResponses()
            });
        });
};

PlayerClient.prototype._handleDismissResponse = function(responseID, respond)
{
    if(this.game.currentJudge.id != this.id)
    {
        logger.warn('Attempted to dismiss response, but not currently the judge. Player:', this.id, this.name);
        respond({
            confirm: false,
            message: "Not callable unless you are the current judge."
        });
    }
    else
    {
        this.game.dismissResponse(responseID)
            .then(function()
            {
                respond({ confirm: true });
            });
    } // end if
}; // end _handleDismissResponse

PlayerClient.prototype._handleSelectResponse = function(responseID, respond)
{
    if(this.game.currentJudge.id != this.id)
    {
        logger.warn('Attempted to select response, but not currently the judge. Player:', this.id, this.name);
        respond({
            confirm: false,
            message: "Not callable unless you are the current judge."
        });
    }
    else
    {
        this.game.selectResponse(responseID)
            .then(function()
            {
                respond({ confirm: true });
            });
    } // end if
}; // end _handleSelectResponse

//----------------------------------------------------------------------------------------------------------------------

PlayerClient.prototype.toJSON = function()
{
    return {
        id: this.id,
        name: this.name,
        type: this.type,
        score: this.score
    }
}; // end toJSON

//----------------------------------------------------------------------------------------------------------------------

module.exports = PlayerClient;

//----------------------------------------------------------------------------------------------------------------------
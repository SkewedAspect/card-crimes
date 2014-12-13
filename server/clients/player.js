//----------------------------------------------------------------------------------------------------------------------
// Represents the client's connection to the game server
//
// @module client.js
//----------------------------------------------------------------------------------------------------------------------

var shortId = require('shortid');
var api = require('../api');

var gameManager = require('../game/manager');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

function PlayerClient(socket)
{
    this.id = shortId.generate();
    this.name = 'Player-' + this.id;
    this.socket = socket;

    this._bindEventHandlers();
} // end GameClient

PlayerClient.prototype._bindEventHandlers = function()
{
    // Socket.io
    this.socket.on('disconnect', this._handleDisconnect.bind(this));

    // Client API
    this.socket.on('client details', this._handleDetails.bind(this));
    this.socket.on('client rename', this._handleClientRename.bind(this));

    // Game API
    this.socket.on('list games', this._handleListGames.bind(this));
    this.socket.on('new game', this._handleCreateGame.bind(this));
    this.socket.on('start game', this._handleStartGame.bind(this));
    this.socket.on('add bot', this._handleAddBot.bind(this));
    this.socket.on('remove bot', this._handleRemoveBot.bind(this));
    this.socket.on('join game', this._handleJoinGame.bind(this));
    this.socket.on('leave game', this._handleLeaveGame.bind(this));
    this.socket.on('draw card', this._handleDrawCard.bind(this));
    this.socket.on('submit cards', this._handleSubmitCards.bind(this));

    // Deck API
    this.socket.on('search decks', this._handleSearchDeck.bind(this));
    this.socket.on('add deck', this._handleAddDeck.bind(this));
    this.socket.on('remove deck', this._handleRemoveDeck.bind(this));
}; // end _bindEventHandlers

//----------------------------------------------------------------------------------------------------------------------
// Event Handlers
//----------------------------------------------------------------------------------------------------------------------

PlayerClient.prototype._handleDisconnect = function()
{
    if(this.game)
    {
        gameManager.leaveGame(this.game.id, this);
    } // end if
}; // end _handleDisconnect

PlayerClient.prototype._handleDetails = function(respond)
{
    respond({
        confirm: true,
        id: this.id,
        name: this.name
    });
}; // end _handleDetails

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
    joinPromise.then(function(game)
    {
        self.game = game;

        respond({
            confirm: true,
            game: game
        });
    });
}; // end _handleJoinGame

PlayerClient.prototype._handleLeaveGame = function(gameID, respond)
{
    gameManager.leaveGame(gameID, this)
        .then(function()
        {
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
    this.game.submitResponse(this, cards)
        .then(function(responseID)
        {
            respond({
                confirm: true,
                response: responseID
            });
        });
};

//----------------------------------------------------------------------------------------------------------------------

PlayerClient.prototype.toJSON = function()
{
    return {
        id: this.id,
        name: this.name,
        type: this.type
    }
}; // end toJSON

//----------------------------------------------------------------------------------------------------------------------

module.exports = PlayerClient;

//----------------------------------------------------------------------------------------------------------------------
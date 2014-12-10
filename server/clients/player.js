//----------------------------------------------------------------------------------------------------------------------
// Represents the client's connection to the game server
//
// @module client.js
//----------------------------------------------------------------------------------------------------------------------

var shortId = require('shortid');
var api = require('../api');

var gameManager = require('../game/manager');

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
    // Client API
    this.socket.on('client details', this._handleDetails.bind(this));
    this.socket.on('client rename', this._handleClientRename.bind(this));

    // Game API
    this.socket.on('list games', this._handleListGames.bind(this));
    this.socket.on('new game', this._handleCreateGame.bind(this));
    this.socket.on('start game', this._handleStartGame.bind(this));
    this.socket.on('add bot', this._handleAddBot.bind(this));
    this.socket.on('remove bot', this._handleAddBot.bind(this));

    // Deck API
    this.socket.on('search decks', this._handleSearchDeck.bind(this));
    this.socket.on('add deck', this._handleAddDeck.bind(this));
    this.socket.on('remove deck', this._handleRemoveDeck.bind(this));
}; // end _bindEventHandlers

//----------------------------------------------------------------------------------------------------------------------
// Event Handlers
//----------------------------------------------------------------------------------------------------------------------

PlayerClient.prototype._handleDetails = function(respond)
{
    respond({
        id: this.id,
        name: this.name
    });
}; // end _handleDetails

PlayerClient.prototype._handleClientRename = function(name, respond)
{
    this.name = name;
    respond();
}; // end _handleClientRename

PlayerClient.prototype._handleListGames = function(respond)
{
    gameManager.listGames()
        .then(function(games)
        {
            respond({
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
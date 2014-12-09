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
    this.socket.on('client details', this._handleDetails.bind(this));
    this.socket.on('client rename', this._handleClientRename.bind(this));
    this.socket.on('list games', this._handleListGames.bind(this));
    this.socket.on('new game', this._handleCreateGame.bind(this));
    this.socket.on('search decks', this._handleSearchDeck.bind(this));
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
            console.log("made game!", JSON.stringify(game));

            // Store this game as ours
            self.game = game;

            respond({
                game: game
            });
        });
}; // end _handleCreateName

PlayerClient.prototype._handleSearchDeck = function(query, respond)
{
    api.search(query)
        .then(function(decks)
        {
            respond({
                decks: decks
            });
        });
}; // end _handleSearchDeck

//----------------------------------------------------------------------------------------------------------------------

PlayerClient.prototype.toJSON = function()
{
    return {
        id: this.id,
        name: this.name
    }
}; // end toJSON

//----------------------------------------------------------------------------------------------------------------------

module.exports = PlayerClient;

//----------------------------------------------------------------------------------------------------------------------
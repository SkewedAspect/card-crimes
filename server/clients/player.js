//----------------------------------------------------------------------------------------------------------------------
// Represents the client's connection to the game server
//
// @module client.js
//----------------------------------------------------------------------------------------------------------------------

var uuid = require('node-uuid');

var gameManager = require('../game/manager');

//----------------------------------------------------------------------------------------------------------------------

function PlayerClient(socket)
{
    this.id = uuid.v4();
    this.name = 'Player-' + this.id;
    this.socket = socket;

    this._bindEventHandlers();
} // end GameClient

PlayerClient.prototype._bindEventHandlers = function()
{
    this.socket.on('client details', this._handleDetails.bind(this));
    this.socket.on('client rename', this._handleClientRename.bind(this));
    this.socket.on('list games', this._handleListGames.bind(this));
}; // end _bindEventHandlers

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

//----------------------------------------------------------------------------------------------------------------------

module.exports = PlayerClient;

//----------------------------------------------------------------------------------------------------------------------
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
    this.socket = socket;

    this._bindEventHandlers();
} // end GameClient

PlayerClient.prototype._bindEventHandlers = function()
{
    this.socket.on('list games', this._handleListGames.bind(this));
}; // end _bindEventHandlers

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
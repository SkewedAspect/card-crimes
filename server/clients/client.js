//----------------------------------------------------------------------------------------------------------------------
// The base client object
//
// @module client.js
//----------------------------------------------------------------------------------------------------------------------

function Client(socket)
{
    //TODO: Use a funny name generator, perhaps like this: https://www.npmjs.com/package/darmok
    this.name = "Player-" + Date.now();

    this.socket = socket;
    this.type = 'human';

    // Listen for specific messages
    this.socket.on('join game', this._handleJoinGame.bind(this));
} // end Client

Client.prototype = {
    get session(){ return this.socket.request.session; },
    get id(){ return this.session.id }
}; // end prototype

Client.prototype._handleJoinGame = function(payload)
{
    // Prevent a circular reference
    var gameMgr = require('../game/manager');
    var game = gameMgr[payload.game];

    game.join(this);
}; // end _handleJoinGame

Client.prototype.toJSON = function()
{
    return {
        id: this.id,
        name: this.name,
        type: this.type
    }
}; // end toJSON

//----------------------------------------------------------------------------------------------------------------------

module.exports = Client;

//----------------------------------------------------------------------------------------------------------------------
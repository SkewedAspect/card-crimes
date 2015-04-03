//----------------------------------------------------------------------------------------------------------------------
// The base client object
//
// @module client.js
//----------------------------------------------------------------------------------------------------------------------

var shortId = require('shortid');

//----------------------------------------------------------------------------------------------------------------------

function Client(socket)
{
    this.socket = socket;
    this.type = 'human';

    // Listen for specific messages
    this.socket.on('join game', this._handleJoinGame.bind(this));
    this.socket.on('watch game', this._handleWatchGame.bind(this));
    this.socket.on('unwatch game', this._handleUnwatchGame.bind(this));
    this.socket.on('rename client', this._handleRenameClient.bind(this));
} // end Client

Client.prototype = {
    get session(){ return this.socket.request.session; },
    get id(){ return this.session.id },
    get name()
    {
        if(!this.session.name)
        {
            //TODO: Use a funny name generator, perhaps like this: https://www.npmjs.com/package/darmok
            this.session.name = "Player-" + shortId.generate();
            this.session.save();
        } // end if

        return this.session.name;
    },
    set name(val)
    {
        // Inform other players of the rename
        if(this.game)
        {
            this.game._broadcast('client rename', { client: this })
        } // end if

        this.session.name = val;
        this.session.save();
    }
}; // end prototype

Client.prototype._handleJoinGame = function(gameID)
{
    console.log('handling join game', gameID);
    // Prevent a circular reference
    var gameMgr = require('../game/manager');
    var game = gameMgr.games[gameID];

    if(game)
    {
        console.log('got game!');
        // Store the game
        this.game = game;

        console.log('joining game!', gameID);

        // Actually join the game
        game.join(this);
    } // end if
}; // end _handleJoinGame

Client.prototype._handleWatchGame = function(gameID)
{
    this.socket.join(gameID);
}; // end _handleWatchGame

Client.prototype._handleUnwatchGame = function(gameID)
{
    this.socket.leave(gameID);
}; // end _handleUnwatchGame

Client.prototype._handleRenameClient = function(name, respond)
{
    this.name = name;
    respond();
}; // end _handleRenameClient

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
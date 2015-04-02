//----------------------------------------------------------------------------------------------------------------------
// Client Manager - handles incoming connections and fires events about connection and disconnection. Games connect to
// these events, and handle connection and disconnection as they feel is appropriate.
//
// @module clientMgr.js
//----------------------------------------------------------------------------------------------------------------------

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var socketio = require('socket.io');

var Client = require('./client');

//----------------------------------------------------------------------------------------------------------------------

function ClientManager()
{
    EventEmitter.call(this);
} // end ClientManager

util.inherits(ClientManager, EventEmitter);

ClientManager.prototype.registerSocketIO = function(app, httpServer)
{
    this.io = socketio(httpServer);

    // Add the session middleware in
    this.io.use(function(socket, next)
    {
        app.locals.sessionMiddleware(socket.request, socket.request.res, next);
    });

    // Listen for connection events
    this.io.on('connection', this._handleConnection.bind(this));
}; // end registerSocketIO

ClientManager.prototype._handleConnection = function(socket)
{
    var client = new Client(socket);

    // Bind our disconnect handler
    socket.on('disconnect', this._handleDisconnect.bind(this, client));

    // Send the client it's session
    socket.emit('new client', client);

    this.emit('connection', client);
}; // end _handleConnection

ClientManager.prototype._handleDisconnect = function(client, reason)
{
    this.emit('disconnect', client, reason);
}; // end _handleDisconnection

//----------------------------------------------------------------------------------------------------------------------

module.exports = new ClientManager();

//----------------------------------------------------------------------------------------------------------------------
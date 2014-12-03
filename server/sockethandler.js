//----------------------------------------------------------------------------------------------------------------------
// Brief description for sockethandler.js module.
//
// @module sockethandler.js
//----------------------------------------------------------------------------------------------------------------------

var PlayerClient = require('./clients/player');

//----------------------------------------------------------------------------------------------------------------------

function socketHandler(app, httpServer)
{
    app.locals.clients = [];
    var io = require('socket.io')(httpServer);

    io.on('connection', function(socket)
    {
        app.locals.clients.push(new PlayerClient(socket));
    });

    //TODO: Disconnection
} // end socketHandler

//----------------------------------------------------------------------------------------------------------------------

module.exports = socketHandler;

//----------------------------------------------------------------------------------------------------------------------
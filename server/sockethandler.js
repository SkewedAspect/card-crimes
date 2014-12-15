//----------------------------------------------------------------------------------------------------------------------
// Brief description for sockethandler.js module.
//
// @module sockethandler.js
//----------------------------------------------------------------------------------------------------------------------

var PlayerClient = require('./clients/player');

//----------------------------------------------------------------------------------------------------------------------

function socketHandler(app, httpServer)
{
    app.locals.clients = {};
    var io = require('socket.io')(httpServer);

    io.on('connection', function(socket)
    {
        var client = new PlayerClient(socket);
        client.negotiateSecret(app.locals.clients)
            .then(function(client)
            {
                app.locals.clients[client.secret] = client;
            });
    });
} // end socketHandler

//----------------------------------------------------------------------------------------------------------------------

module.exports = socketHandler;

//----------------------------------------------------------------------------------------------------------------------
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
        // We handle the client details message, so we can create a client with all the right details.
        socket.on('client details', function(payload, respond)
        {
            var client = new PlayerClient(socket);

            // Set properties
            client.name = payload.name || client.name;
            client.secret = payload.secret || client.secret;

            // Check our secret, to make sure this isn't a reconnect
            client.negotiateSecret(app.locals.clients[client.secret])
                .then(function(client)
                {
                    app.locals.clients[client.secret] = client;

                    // We can't rely on the JSON serialization, because secret is not included in that.
                    respond({
                        id: client.id,
                        name: client.name,
                        score: client.score,
                        secret: client.secret,
                        game: client.game
                    });
                });
        });
    });
} // end socketHandler

//----------------------------------------------------------------------------------------------------------------------

module.exports = socketHandler;

//----------------------------------------------------------------------------------------------------------------------
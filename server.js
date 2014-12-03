//----------------------------------------------------------------------------------------------------------------------

// Brief description for server.js module.
//
// @module server.js
//----------------------------------------------------------------------------------------------------------------------

var express = require('express');

var package = require('./package');
var router = require('./server/routes');
var socketHandler = require('./server/sockethandler');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

// Build the express app
var app = express();

// Set up our application routes
app.use('/', router);

// Start the server
var server = app.listen(3000, function()
{
    var host = server.address().address;
    var port = server.address().port;

    logger.info('CardCrimes server v%s listening at http://%s:%s', package.version, host, port);
});

// Set up socket.io
socketHandler(app, server);


//----------------------------------------------------------------------------------------------------------------------
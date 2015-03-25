//----------------------------------------------------------------------------------------------------------------------
// Brief description for server.js module.
//
// @module server.js
//----------------------------------------------------------------------------------------------------------------------

var logging = require('omega-logger');

if(process.env.LOG_LEVEL)
{
    logging.defaultConsoleHandler.level = logging.getLevel(process.env.LOG_LEVEL);
} // end if

var logger = logging.getLogger('server');

//----------------------------------------------------------------------------------------------------------------------

var path = require('path');

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var package = require('./package');
var config = require('./config');

// Routers
var routeUtils = require('./server/routes/utils');
var gameRouter = require('./server/routes/game');

var socketHandler = require('./server/sockethandler');

//----------------------------------------------------------------------------------------------------------------------

// Build the express app
var app = express();

// Basic request logging
app.use(routeUtils.requestLogger(logger));

// Basic error logging
app.use(routeUtils.errorLogger(logger));

// Session support
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: config.secret || 'nosecret',
    key: config.key || 'cardcrimes-session',
    resave: false,
    rolling: true,

    // maxAge = 12hrs
    cookie: { maxAge: 1000 * 60 * 60 * 12},
    saveUninitialized: true
}));

// Add our project version as a header
app.use(function(req, resp, next)
{
    resp.append('Version', package.version);
    next();
});

// Setup static serving
app.use(express.static(path.resolve('./client')));

// Serve index.html
app.get('/', routeUtils.serveIndex);

// Set up our application routes
app.use('/game', gameRouter);

// Start the server
var server = app.listen(config.port || 3000, function()
{
    var host = server.address().address;
    var port = server.address().port;

    logger.info('CardCrimes server v%s listening at http://%s:%s', package.version, host, port);
});

// Set up socket.io
socketHandler(app, server);


//----------------------------------------------------------------------------------------------------------------------
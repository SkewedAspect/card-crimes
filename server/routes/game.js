//----------------------------------------------------------------------------------------------------------------------
// Routes for game page
//
// @module game.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var express = require('express');

var routeUtils = require('./utils');
var manager = require('../game/manager');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

var router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Middleware
//----------------------------------------------------------------------------------------------------------------------

// Basic request logging
router.use(routeUtils.requestLogger(logger));

// Basic error logging
router.use(routeUtils.errorLogger(logger));

//----------------------------------------------------------------------------------------------------------------------
// REST Endpoints
//----------------------------------------------------------------------------------------------------------------------

router.get('/', function(req, resp)
{
    routeUtils.interceptHTML(resp, function()
    {
        manager.listGames()
            .then(function(games)
            {
                if(req.query.name)
                {
                    resp.json(_.filter(games, { name: req.query.name }));
                }
                else
                {
                    resp.json(games);
                } // end if
            });
    });
});

router.put('/', function(req, resp)
{
    var game = manager.newGame(req.body.name, req.body.options, req.body.decks);
    resp.json(game);
});

router.get('/*', function(req, resp)
{
    routeUtils.interceptHTML(resp, function()
    {
        // Get wildcard parameter
        var gameID = req.params[0];
        var game = manager.games[gameID];

        if(game)
        {
            resp.json(game);
        }
        else
        {
            resp.status(404).end();
        } // end if
    });
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------
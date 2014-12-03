// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the game.spec.js module.
//
// @module game.spec.js
// ---------------------------------------------------------------------------------------------------------------------

var assert = require("assert");
var EventEmitter = require('events').EventEmitter;

var uuid = require('node-uuid');

var Game = require('../../server/game/game');

// ---------------------------------------------------------------------------------------------------------------------

function TestClient()
{
    this.id = uuid.v4();
    this.socket = new EventEmitter();
} // end TestClient

// ---------------------------------------------------------------------------------------------------------------------

describe('Game', function()
{
    var game, creator;

    beforeEach(function()
    {
        creator = new TestClient();
        game = new Game('Test Game', creator);
    });


    it('converts to a simple JSON object', function()
    {
        var gameObj = JSON.parse(JSON.stringify(game));

        assert.equal(gameObj.id, game.id);
        assert.equal(gameObj.name, game.name);
        assert.equal(gameObj.state, game.state);
    });

    describe('API Tests', function()
    {
        it('can rename the game', function(done)
        {
            game.rename('New Test Name')
                .then(function()
                {
                    assert.equal(game.name, 'New Test Name');
                    done();
                });
        });

        xit('can add a deck', function()
        {
            assert(false, "Not Implemented.");
        });

        xit('can remove a deck', function()
        {
            assert(false, "Not Implemented.");
        });

        xit('can start the game', function()
        {
            assert(false, "Not Implemented.");
        });

        xit('will not start the game with < 2 players', function()
        {
            assert(false, "Not Implemented.");
        });

        xit('players can join the game', function()
        {
            assert(false, "Not Implemented.");
        });

        xit('players can leave the game', function()
        {
            assert(false, "Not Implemented.");
        });

        xit('spectators can join the game', function()
        {
            assert(false, "Not Implemented.");
        });

        xit('spectators can leave the game', function()
        {
            assert(false, "Not Implemented.");
        });

        xit('can add a random AI player', function()
        {
            assert(false, "Not Implemented.");
        });

        xit('can draw a random response', function()
        {
            assert(false, "Not Implemented.");
        });

        xit('can submit responses for judging', function()
        {
            assert(false, "Not Implemented.");
        });

        xit('can dismiss submitted responses', function()
        {
            assert(false, "Not Implemented.");
        });

        xit('can select a winning response', function()
        {
            assert(false, "Not Implemented.");
        });
    });

    describe('Game State Tests', function()
    {
        describe('Initial State', function()
        {
            it("starts in the `'initial'` state", function()
            {
                assert.equal(game.state, 'initial');
            });
        });

        describe('New Round State', function()
        {
        });

        describe('Waiting State', function()
        {
        });

        describe('Judging', function()
        {
        });

        describe('Paused', function()
        {
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
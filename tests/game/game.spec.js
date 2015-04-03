// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the game.spec.js module.
//
// @module game.spec.js
// ---------------------------------------------------------------------------------------------------------------------

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var _ = require('lodash');
var Promise = require('bluebird');
var expect = require('chai').expect;
var shortId = require('shortid');

var api = require('../../server/api');
var clientMgr = require('../../server/clients/clientMgr');
var Client = require('../../server/clients/client');
var Game = require('../../server/game/game');

var testDeck = require('../data/testdeck');

// ---------------------------------------------------------------------------------------------------------------------
// SocketIO Mock
// ---------------------------------------------------------------------------------------------------------------------

var rooms = {};

clientMgr.io = {
    of: function(ns)
    {
        return {
            to: function(room)
            {
                var ee = rooms[room];
                if(!ee)
                {
                    ee = new EventEmitter();
                    ee.ns = ns;
                    ee.room = room;
                    rooms[room] = ee;
                } // end if

                return ee;
            }
        }
    }
};

// ---------------------------------------------------------------------------------------------------------------------
// Fake Sockets with Sessions
// ---------------------------------------------------------------------------------------------------------------------

function FakeSocket()
{
    EventEmitter.call(this);
    this.request = {
        session: {
            id: shortId.generate()
        }
    }
} // end FakeSocket

util.inherits(FakeSocket, EventEmitter);

// ---------------------------------------------------------------------------------------------------------------------

describe('Game', function()
{
    var game, player1, player2, player3;

    beforeEach(function()
    {
        // Mock api
        api.decksOrig = api.deck;
        api.deck = function(){ return Promise.resolve(testDeck); };

        player1 = new Client(new FakeSocket());
        player2 = new Client(new FakeSocket());
        player3 = new Client(new FakeSocket());
        game = new Game('Test Game', {}, ['CAHBS']);
    });

    afterEach(function()
    {
        // UnMock api
        api.deck = api.decksOrig;
    });

    it('converts to a simple JSON object', function()
    {
        var gameObj = JSON.parse(JSON.stringify(game));

        expect(gameObj).to.have.property('id', game.id);
        expect(gameObj).to.have.property('name', game.name);
        expect(gameObj).to.have.property('state', game.state);
    });

    it('correctly populates the decks after creation', function(done)
    {
        var room = game.room;
        room.on('paused', function()
        {
            expect(game.totalCalls.length).to.equal(90);
            expect(game.calls.length).to.equal(90);
            expect(game.totalResponses.length).to.equal(458);
            expect(game.responses.length).to.equal(458);
            done();
        });
    });

    it('adds bots during game creation', function()
    {
        game = new Game('Test Game', { bots: ['Bender', 'R2-D2']}, ['CAHBS']);

        expect(game.botPlayers[0].name).to.equal('Bender');
        expect(game.botPlayers[1].name).to.equal('R2-D2');
    });

    it('enters a paused state after creation', function(done)
    {
        var room = game.room;
        room.on('paused', function()
        {
            done();
        });
    });

    it('starts a new round after 2 humans join the game', function(done)
    {
        var room = game.room;

        room.on('paused', function()
        {
            game.join(player1);
            game.join(player2);
        });

        room.on('new round', function()
        {
            expect(game.humanPlayers.length).to.equal(2);
        });

        room.on('round start', function(payload)
        {
            expect(payload.judge).to.equal(player1.id);
            expect(payload.call.id).to.equal(game.call.id);
            done();
        });
    });

    it('does not include bots when checking to see if there is enough players to start a round', function(done)
    {
        game = new Game('Test Game', { bots: ['Bender', 'R2-D2']}, ['CAHBS']);
        var room = game.room;

        room.on('paused', function()
        {
            game.join(player1);
            setTimeout(done, 30);
        });

        room.on('new round', function()
        {
            console.log('new round started!');
            done(new Error("A new round started"));
        });
    });

    it('gives joining players a new hand of cards', function(done)
    {
        player1.socket.on('hand', function(hand)
        {
            expect(hand.length).to.equal(10);
            done();
        });

        var room = game.room;
        room.on('paused', function()
        {
            game.join(player1);
        });
    });

    it('players can submit a response', function(done)
    {
        var room = game.room;

        room.on('paused', function()
        {
            game.join(player1);
            game.join(player2);
            game.join(player3);
        });

        room.on('round start', function()
        {
            expect(game.humanPlayers.length).to.equal(3);
            player2.socket.emit('submit response', game.players[player2.id].hand[0]);
        });

        room.on('response submitted', function(payload)
        {
            expect(payload.player).to.equal(player2.id);
            done();
        });
    });

    it('players are given new cards after submitting a response', function(done)
    {
        var room = game.room;

        room.on('paused', function()
        {
            game.join(player1);
            game.join(player2);
            game.join(player3);
        });

        room.on('round start', function()
        {
            expect(game.humanPlayers.length).to.equal(3);
            player2.socket.on('hand', function(hand)
            {
                expect(hand.length).to.equal(10);
                done();
            });

            player2.socket.emit('submit response', game.players[player2.id].hand[0]);
        });
    });

    it('once all responses are in, we transition to `judging`', function(done)
    {
        var room = game.room;

        room.on('paused', function()
        {
            game.join(player1);
            game.join(player2);
            game.join(player3);
        });

        room.on('round start', function()
        {
            expect(game.humanPlayers.length).to.equal(3);
            player2.socket.emit('submit response', game.players[player2.id].hand[0]);
            player3.socket.emit('submit response', game.players[player3.id].hand[0]);
        });

        room.on('judging', function()
        {
            done();
        });
    });

    it('the judge can dismiss a response', function(done)
    {
        var dismissedID;
        var room = game.room;

        room.on('paused', function()
        {
            game.join(player1);
            game.join(player2);
            game.join(player3);
        });

        room.on('round start', function()
        {
            expect(game.humanPlayers.length).to.equal(3);
            player2.socket.emit('submit response', game.players[player2.id].hand[0]);
            player3.socket.emit('submit response', game.players[player3.id].hand[0]);
        });

        room.on('judging', function()
        {
            dismissedID = _.keys(game.submittedResponses)[0];
            player1.socket.emit('dismiss response', dismissedID);
        });

        room.on('dismissed response', function(payload)
        {
            expect(payload.response).to.equal(dismissedID);
            done();
        });
    });

    it('once the judge selects a response, we inform everyone of the winners and start a new round', function(done)
    {
        var selectedID;
        var room = game.room;

        room.on('paused', function()
        {
            game.join(player1);
            game.join(player2);
            game.join(player3);
        });

        room.once('round start', function()
        {
            expect(game.humanPlayers.length).to.equal(3);
            player2.socket.emit('submit response', game.players[player2.id].hand[0]);
            player3.socket.emit('submit response', game.players[player3.id].hand[0]);
        });

        room.once('judging', function()
        {
            selectedID = _.keys(game.submittedResponses)[0];
            player1.socket.emit('select response', selectedID);
        });

        room.once('selected response', function(payload)
        {
            expect(payload.response.id).to.equal(selectedID);

            room.once('new round', function()
            {
                done();
            });
        });

    });

    it('the winner of a round has their points increase', function(done)
    {
        var selectedID;
        var room = game.room;

        room.on('paused', function()
        {
            game.join(player1);
            game.join(player2);
            game.join(player3);
        });

        room.once('round start', function()
        {
            expect(game.humanPlayers.length).to.equal(3);
            player2.socket.emit('submit response', game.players[player2.id].hand[0]);
            player3.socket.emit('submit response', game.players[player3.id].hand[0]);
        });

        room.once('judging', function()
        {
            selectedID = _.keys(game.submittedResponses)[0];
            player1.socket.emit('select response', selectedID);
        });

        room.once('selected response', function(payload)
        {
            expect(game.players[payload.response.player.id].score).to.equal(1);
            done();
        });
    });

    describe('Connections', function()
    {
        beforeEach(function()
        {
            player1 = new Client(new FakeSocket());
            player2 = new Client(new FakeSocket());
            player3 = new Client(new FakeSocket());
            game = new Game('Test Game', {}, ['CAHBS']);

        });

        it('players can reconnect without losing their state', function(done)
        {
            var selectedID;
            var room = game.room;

            room.on('paused', function()
            {
                game.join(player1);
                game.join(player2);
                game.join(player3);
            });

            room.once('round start', function()
            {
                expect(game.humanPlayers.length).to.equal(3);
                player2.socket.emit('submit response', game.players[player2.id].hand[0]);
                player3.socket.emit('submit response', game.players[player3.id].hand[0]);
            });

            room.once('judging', function()
            {
                selectedID = _.keys(game.submittedResponses)[0];
                player1.socket.emit('select response', selectedID);
            });

            room.once('selected response', function(payload)
            {
                var winner = payload.response.player;
                expect(game.players[winner.id].score).to.equal(1);


                room.once('player joined', function(payload)
                {
                    expect(payload.player.id).to.equal(winner.id);
                    expect(payload.score).to.equal(1);
                    done();
                });

                // Simulate reconnect
                game.join(winner);
            });
        });

        it('removes the state of players who leave and rejoin', function(done)
        {
            var selectedID;
            var room = game.room;

            room.on('paused', function()
            {
                game.join(player1);
                game.join(player2);
                game.join(player3);
            });

            room.once('round start', function(payload)
            {
                expect(game.humanPlayers.length).to.equal(3);
                player2.socket.emit('submit response', game.players[player2.id].hand[0]);
                player3.socket.emit('submit response', game.players[player3.id].hand[0]);
            });

            room.once('judging', function()
            {
                selectedID = _.keys(game.submittedResponses)[0];
                player1.socket.emit('select response', selectedID);
            });

            room.once('selected response', function(payload)
            {
                var winner = payload.response.player;
                expect(game.players[winner.id].score).to.equal(1);


                room.once('player joined', function(payload)
                {
                    expect(payload.player.id).to.equal(winner.id);
                    expect(payload.score).to.equal(0);
                    done();
                });

                room.once('player left', function(payload)
                {
                    expect(payload.player.id).to.equal(winner.id);

                    // Wait a little bit
                    setTimeout(function()
                    {
                        // Rejoin
                        game.join(winner);
                    }, 20);
                });

                winner.socket.emit('leave game');
            });
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the game.spec.js module.
//
// @module game.spec.js
// ---------------------------------------------------------------------------------------------------------------------

var assert = require("assert");
var EventEmitter = require('events').EventEmitter;

var _ = require('lodash');
var Promise = require('bluebird');

var PlayerClient = require('../../server/clients/player');
var Game = require('../../server/game/game');

// ---------------------------------------------------------------------------------------------------------------------

//TODO: Mock out cardcast-api, so we're not hitting their site for our unit tests.

describe('Game', function()
{
    var game, creator, player1, player2;

    beforeEach(function()
    {
        creator = new PlayerClient(new EventEmitter());
        player1 = new PlayerClient(new EventEmitter());
        player2 = new PlayerClient(new EventEmitter());
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

        it('can add a deck', function(done)
        {
            game.addDeck('NJ3HX')
                .then(function()
                {
                    assert('NJ3HX' in game.decks, "Deck not successfully added.");
                    done();
                });
        });

        it('can remove a deck', function(done)
        {
            game.addDeck('NJ3HX')
                .then(function()
                {
                    return game.removeDeck('NJ3HX');
                })
                .then(function()
                {
                    assert(!('NJ3HX' in game.decks), "Deck not successfully removed.");
                    done();
                });
        });

        it('can start the game', function(done)
        {
            Promise.all([
                    game.addDeck('NJ3HX'),
                    game.join(player1),
                    game.join(player2)
                ])
                .then(function()
                {
                    return game.start();
                })
                .then(function()
                {
                    done();
                });
        });

        it('will not start the game with < 2 players', function(done)
        {
            Promise.all([
                    game.addDeck('NJ3HX')
                ])
                .then(function()
                {
                    return game.start();
                })
                .catch(function()
                {
                    done();
                });
        });
        it('will not start the game with no decks', function(done)
        {
            Promise.all([
                    game.join(player1),
                    game.join(player2)
                ])
                .then(function()
                {
                    return game.start();
                })
                .catch(function(error)
                {
                    done();
                });
        });

        it('players can join the game', function(done)
        {
            Promise.all([
                    game.join(player1),
                    game.join(player2)
                ])
                .then(function()
                {
                    assert.equal(game.players.length, 3);
                    done();
                });
        });

        it('players can leave the game', function(done)
        {
            Promise.all([
                    game.join(player1),
                    game.join(player2)
                ])
                .then(function()
                {
                    return Promise.all([
                        game.leave(player1),
                        game.leave(player2)
                    ]);
                })
                .then(function()
                {
                    assert.equal(game.players.length, 1);
                    done();
                });
        });

        it('spectators can join the game', function(done)
        {
            Promise.all([
                    game.spectatorJoin(player1),
                    game.spectatorJoin(player2)
                ])
                .then(function()
                {
                    assert.equal(game.spectators.length, 2);
                    done();
                });
        });

        it('spectators can leave the game', function(done)
        {
            Promise.all([
                game.spectatorJoin(player1),
                game.spectatorJoin(player2)
            ])
                .then(function()
                {
                    return Promise.all([
                        game.spectatorLeave(player1),
                        game.spectatorLeave(player2)
                    ]);
                })
                .then(function()
                {
                    assert.equal(game.spectators.length, 0);
                    done();
                });
        });

        it('can add a random AI player', function(done)
        {
            game.addRandomPlayer('Rando')
                .then(function()
                {
                    var rando = game.players[1];
                    assert(rando != undefined, "Random player failed to add.");
                    assert.equal(rando.name, 'Rando');
                    done();
                });
        });

        it('can draw a random response', function(done)
        {
            var responsesTotal = 0;

            Promise.all([
                    game.addDeck('NJ3HX'),
                    game.join(player1),
                    game.join(player2)
                ])
                .then(function()
                {
                    return game.start();
                })
                .then(function()
                {
                    responsesTotal = game.responses.length;
                    return game.drawResponse();
                })
                .then(function(response)
                {
                    assert(response !== undefined, "Failed to draw response card.");
                    assert.equal(game.responses.length, responsesTotal - 1);
                    done();
                });
        });

        it('can submit responses for judging', function(done)
        {
            Promise.all([
                    game.addDeck('NJ3HX'),
                    game.join(player1),
                    game.join(player2)
                ])
                .then(function()
                {
                    return game.start();
                });

            player1.socket.on('next round', function()
            {
                var responsePromises = [];
                _.each(_.range(game.currentCall.numResponses), function()
                {
                    responsePromises.push(game.drawResponse());
                });

                Promise.all(responsePromises)
                    .then(function(responses)
                    {
                        // Turn this into a list of card ids.
                        responses = _.reduce(responses, function(responses, response)
                        {
                            responses.push(response.id);
                            return responses;
                        }, []);

                        return game.submitResponse(player1, responses);
                    })
                    .then(function(responseID)
                    {
                        assert(responseID != undefined, "No response id returned.");
                        assert.equal(_.keys(game.submittedResponses).length, 1);
                        done();
                    });
            });
        });

        it('can dismiss submitted responses', function(done)
        {
            // Random response selection
            function handleNextRound()
            {
                var responsePromises = [];
                _.each(_.range(game.currentCall.numResponses), function()
                {
                    responsePromises.push(game.drawResponse());
                });

                Promise.all(responsePromises)
                    .then(function(responses)
                    {
                        // Turn this into a list of card ids.
                        responses = _.reduce(responses, function(responses, response)
                        {
                            responses.push(response.id);
                            return responses;
                        }, []);

                        return game.submitResponse(player1, responses);
                    });
            } // end handleNextRound

            Promise.all([
                    game.addDeck('NJ3HX'),
                    game.join(player1),
                    game.join(player2)
                ])
                .then(function()
                {
                    return game.start();
                });

            player1.socket.on('next round', handleNextRound);
            player2.socket.on('next round', handleNextRound);

            creator.socket.on('all responses submitted', function()
            {
                game.dismissResponse(_.keys(game.submittedResponses)[0])
                    .then(function()
                    {
                        assert.equal(_.keys(game.submittedResponses).length, 1);
                        done();
                    });
            });
        });

        it('can select a winning response', function(done)
        {
            // Random response selection
            function handleNextRound()
            {
                var responsePromises = [];
                _.each(_.range(game.currentCall.numResponses), function()
                {
                    responsePromises.push(game.drawResponse());
                });

                Promise.all(responsePromises)
                    .then(function(responses)
                    {
                        // Turn this into a list of card ids.
                        responses = _.reduce(responses, function(responses, response)
                        {
                            responses.push(response.id);
                            return responses;
                        }, []);

                        return game.submitResponse(player1, responses);
                    });
            } // end handleNextRound

            Promise.all([
                game.addDeck('NJ3HX'),
                game.join(player1),
                game.join(player2)
            ])
                .then(function()
                {
                    return game.start();
                });

            player1.socket.on('next round', handleNextRound);
            player2.socket.on('next round', handleNextRound);

            creator.socket.on('all responses submitted', function()
            {
                game.selectResponse(_.keys(game.submittedResponses)[0])
                    .then(function()
                    {
                        assert.equal(game.state, 'new round');
                        done();
                    });
            });
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
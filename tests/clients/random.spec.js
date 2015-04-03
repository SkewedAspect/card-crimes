// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the random.spec.js module.
//
// @module random.spec.js
// ---------------------------------------------------------------------------------------------------------------------

var expect = require('chai').expect;

var RandomBot = require('../../server/clients/random');

// ---------------------------------------------------------------------------------------------------------------------

describe('Random Choice Bot', function()
{
    var bot, game;
    beforeEach(function()
    {
        game = {
            call: {
                numResponses: 2
            },
            players: {}
        };

        bot = new RandomBot('Bender', game);
        game.players[bot.id] = { client: bot, hand: [{ id: 'card1' }, { id: 'card2' }]};
    });

    it('converts to a simple JSON object', function()
    {
        var jsonObj = JSON.parse(JSON.stringify(bot));
        expect(jsonObj).to.have.property('id', bot.id);
        expect(jsonObj).to.have.property('type', 'bot');
        expect(jsonObj).to.have.property('name', bot.name);
    });

    it('draws random responses from its hand when a round starts and submits them', function(done)
    {
        bot.socket.on('submit response', function(cardIDs)
        {
            expect(cardIDs.length).to.equal(2);
            expect(cardIDs[0]).to.equal(game.players[bot.id].hand[0].id);
            expect(cardIDs[1]).to.equal(game.players[bot.id].hand[1].id);
            done();
        });

        bot.socket.emit('round start', { judge: 'some-judge', call: game.call });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
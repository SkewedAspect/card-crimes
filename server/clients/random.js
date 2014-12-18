//----------------------------------------------------------------------------------------------------------------------
// Represents an AI player that selects a response at random.
//
// @module random.js
//----------------------------------------------------------------------------------------------------------------------

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var _ = require('lodash');
var Promise = require('bluebird');

var PlayerClient = require('./player');

//----------------------------------------------------------------------------------------------------------------------

function RandomClient(name, game)
{
    // Set our socket as a plain EventEmitter.
    PlayerClient.call(this, new EventEmitter());

    // Manually set the name
    this.name = name;

    // Set our type to 'bot', so the client has some clue who's a bot, and who isn't.
    this.type = 'bot';

    // Store the game we were created for
    this.game = game;

    // Listen for the next round message
    this.socket.on('next round', this.handleNextRound.bind(this));
} // end RandomClient

util.inherits(RandomClient, PlayerClient);

RandomClient.prototype.handleNextRound = function()
{
    var self = this;
    var responsePromises = [];
    _.each(_.range(this.game.currentCall.numResponses), function()
    {
        responsePromises.push(self.game.drawResponse());
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

            return self.game.submitResponse(self, responses);
        });
}; // end handleNextRound

//----------------------------------------------------------------------------------------------------------------------

module.exports = RandomClient;

//----------------------------------------------------------------------------------------------------------------------
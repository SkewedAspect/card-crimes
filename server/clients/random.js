//----------------------------------------------------------------------------------------------------------------------
// Represents an AI player that selects a response at random.
//
// @module random.js
//----------------------------------------------------------------------------------------------------------------------

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var _ = require('lodash');
var Promise = require('bluebird');
var shortId = require('shortid');

var Client = require('./client');

//----------------------------------------------------------------------------------------------------------------------

function RandomBot(name, game)
{
    // Set our socket as a plain EventEmitter.
    Client.call(this, new EventEmitter());

    // Manually set the name
    this.name = name;

    // Manually set our id by creating a fake session
    this.socket.request = { session: { id: shortId.generate() }};

    // Set our type to 'bot', so the client has some clue who's a bot, and who isn't.
    this.type = 'bot';

    // Store the game we were created for
    this.game = game;

    // Listen for the next round message
    this.socket.on('round start', this._handleRoundStart.bind(this));
} // end RandomBot

util.inherits(RandomBot, Client);

RandomBot.prototype._handleRoundStart = function(payload)
{
    var numResponses = payload.call.numResponses;
    var responses = _.reduce(this.game.players[this.id].hand.slice(0, numResponses), function(results, card)
    {
        results.push(card.id);
        return results;
    }, []);
    this.socket.emit('submit response', responses);
}; // end _handleRoundStart

//----------------------------------------------------------------------------------------------------------------------

module.exports = RandomBot;

//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
// Represents an AI player that selects a response at random.
//
// @module random.js
//----------------------------------------------------------------------------------------------------------------------

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var PlayerClient = require('./player');

//----------------------------------------------------------------------------------------------------------------------

function RandomClient(name)
{
    // Set our socket as a plain EventEmitter.
    PlayerClient.call(this, new EventEmitter());

    // Manually set the name
    this.name = name;

    // Set our type to 'bot', so the client has some clue who's a bot, and who isn't.
    this.type = 'bot';
} // end RandomClient

util.inherits(RandomClient, PlayerClient);

//----------------------------------------------------------------------------------------------------------------------

module.exports = RandomClient;

//----------------------------------------------------------------------------------------------------------------------
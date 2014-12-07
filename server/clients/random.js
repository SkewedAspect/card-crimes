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
} // end RandomClient

util.inherits(RandomClient, PlayerClient);

//----------------------------------------------------------------------------------------------------------------------

module.exports = RandomClient;

//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
// Represents an AI player that selects a response at random.
//
// @module random.js
//----------------------------------------------------------------------------------------------------------------------

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var PlayerClient = require('./player');

//----------------------------------------------------------------------------------------------------------------------

function RandomClient()
{
    PlayerClient.call(this);

    // Set our socket as a plain EventEmitter.
    this.socket = new EventEmitter();
} // end RandomClient

util.inherits(RandomClient, PlayerClient);

//----------------------------------------------------------------------------------------------------------------------

module.exports = RandomClient;

//----------------------------------------------------------------------------------------------------------------------
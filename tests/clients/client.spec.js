// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Client module.
//
// @module client.spec.js
// ---------------------------------------------------------------------------------------------------------------------

var EventEmitter = require('events').EventEmitter;

var expect = require('chai').expect;

var Client = require('../../server/clients/client');

// ---------------------------------------------------------------------------------------------------------------------
// Socket Mock
// ---------------------------------------------------------------------------------------------------------------------

var mockSocket = new EventEmitter();
mockSocket.request = { session: { id: 'test-id' } };

// ---------------------------------------------------------------------------------------------------------------------

describe('Client', function()
{
    var client;
    beforeEach(function()
    {
        client = new Client(mockSocket);
    });

    it('converts to a simple JSON object', function()
    {
        var jsonObj = JSON.parse(JSON.stringify(client));
        expect(jsonObj).to.have.property('id', 'test-id');
        expect(jsonObj).to.have.property('name', client.name);
    });
});

// ---------------------------------------------------------------------------------------------------------------------
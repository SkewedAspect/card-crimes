// ---------------------------------------------------------------------------------------------------------------------
// SocketService
//
// @module socket.js
// ---------------------------------------------------------------------------------------------------------------------

function SocketServiceFactory($q, io)
{
    function SocketService()
    {
        var self = this;
        this.socket = io();

        // A simple promise that resolves once we've connected.
        this.initializedPromise = $q(function(resolve)
        {
            self.socket.on('connect', function()
            {
                resolve();
            });
        });
    } // end SocketService

    SocketService.prototype.on = function()
    {
        this.socket.on.apply(this.socket, arguments);
    }; // end on

    SocketService.prototype.emit = function()
    {
        this.socket.emit.apply(this.socket, arguments);
    }; // end emit

    return new SocketService();
} // end SocketServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.services').service('SocketService', [
    '$q',
    'io',
    SocketServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
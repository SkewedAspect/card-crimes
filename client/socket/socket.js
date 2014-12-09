// ---------------------------------------------------------------------------------------------------------------------
// SocketService
//
// @module socket.js
// ---------------------------------------------------------------------------------------------------------------------

function SocketServiceFactory(Promise, $timeout, io, _)
{
    function SocketService()
    {
        var self = this;
        this.socket = io();

        // A simple promise that resolves once we've connected.
        this.initializedPromise = Promise(function(resolve)
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
        var self = this;
        var args = _.toArray(arguments);

        return Promise(function(resolve)
        {
            function callback()
            {
                var args = _.toArray(arguments);

                if(args.length < 2)
                {
                    resolve(args[0]);
                }
                else
                {
                    resolve(args);
                } // end if


                // Schedule a digest for the next tick
                $timeout(function(){});
            } // end callback

            // Add our custom callback
            args.push(callback);

            self.socket.emit.apply(self.socket, args);
        });
    }; // end emit

    return new SocketService();
} // end SocketServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.services').service('SocketService', [
    '$q',
    '$timeout',
    'io',
    'lodash',
    SocketServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
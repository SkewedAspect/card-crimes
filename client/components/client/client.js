// ---------------------------------------------------------------------------------------------------------------------
// ClientService
//
// @module client.js
// ---------------------------------------------------------------------------------------------------------------------

function ClientServiceFactory(socketSvc)
{
    function ClientService()
    {
        this.session = {};

        socketSvc.on('new client', this._handleNewClient.bind(this))
    } // end ClientService

    ClientService.prototype = {
        get name(){ return this.session.name; }
    }; // end prototype

    // -----------------------------------------------------------------------------------------------------------------
    // Event Handlers
    // -----------------------------------------------------------------------------------------------------------------

    ClientService.prototype._handleNewClient = function(session)
    {
        // What we get is, really, just the session object.
        this.session = session;
    }; // end _handleNewClient

    // -----------------------------------------------------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------------------------------------------------

    ClientService.prototype.rename = function(name)
    {
        var self = this;
        return socketSvc.initializedPromise
            .then(function()
            {
                return socketSvc.emit('rename client', name)
                    .then(function()
                    {
                        self.session.name = name;
                    });
            });
    }; // end rename

    // -----------------------------------------------------------------------------------------------------------------

    return new ClientService();
} // end ClientServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.services').service('ClientService', [
    'SocketService',
    ClientServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
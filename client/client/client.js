// ---------------------------------------------------------------------------------------------------------------------
// ClientService
//
// @module client.js
// ---------------------------------------------------------------------------------------------------------------------

function ClientServiceFactory($cookieStore, socket)
{
    function ClientService()
    {
        var self = this;
        this.initializedPromise = socket.initializedPromise
            .then(function()
            {
                // Get the player id, and current name.
                return socket.emit('client details')
                    .then(function(payload)
                    {
                        self.id = payload.id;
                        self.name = payload.name;
                    });
            })
            .then(function()
            {
                // Check our cookies for our previous player name
                var playerName = $cookieStore.get('playerName');

                if(playerName)
                {
                    // Immediately set our player name
                    return self.rename(playerName);
                } // end if
            });

        // Bind the events
        this._bindEventHandlers();
    } // end ClientService

    // -----------------------------------------------------------------------------------------------------------------

    ClientService.prototype._bindEventHandlers = function()
    {
        socket.on('negotiate secret', this.handleNegotiateSecret.bind(this));
    }; // end _bindEventHandlers

    // -----------------------------------------------------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------------------------------------------------

    ClientService.prototype.rename = function(name)
    {
        var self = this;
        return socket.emit('client rename', name)
            .then(function()
            {
                self.name = name;
                $cookieStore.put('playerName', name);
            });
    }; // end rename

    // -----------------------------------------------------------------------------------------------------------------
    // Event Handlers
    // -----------------------------------------------------------------------------------------------------------------

    ClientService.prototype.handleNegotiateSecret = function(payload, respond)
    {
        var secret = $cookieStore.get('secret');

        if(secret)
        {
            respond({
                confirm: false,
                secret: secret
            });
        }
        else
        {
            // Store our cookie
            $cookieStore.put('secret', payload.secret);
            respond({ confirm: true });
        } // end if
    }; // end handleNegotiateSecret

    return new ClientService();
} // end ClientServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.services').service('ClientService', [
    '$cookieStore',
    'SocketService',
    ClientServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
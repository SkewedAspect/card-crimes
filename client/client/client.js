// ---------------------------------------------------------------------------------------------------------------------
// ClientService
//
// @module client.js
// ---------------------------------------------------------------------------------------------------------------------

function ClientServiceFactory($q, $cookieStore, socket)
{
    function ClientService()
    {
        var self = this;
        this.initializedPromise = socket.initializedPromise
            .then(function()
            {
                // Get the player id, and current name.
                return $q(function(resolve)
                {
                    socket.emit('client details', function(payload)
                    {
                        self.id = payload.id;
                        self.name = payload.name;
                        resolve();
                    });
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
    } // end ClientService

    ClientService.prototype.rename = function(name)
    {
        var self = this;
        return $q(function(resolve)
        {
            socket.emit('client rename', name, function()
            {
                self.name = name;
                $cookieStore.put('playerName', name);
                resolve();
            });
        });
    }; // end rename

    return new ClientService();
} // end ClientServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.services').service('ClientService', [
    '$q',
    '$cookieStore',
    'SocketService',
    ClientServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
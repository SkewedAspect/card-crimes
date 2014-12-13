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

        socket.on('next round', function(payload)
        {
            console.log('next round:', payload);
        });

        socket.on('player joined', function(payload)
        {
            console.log('player joined:', payload);
        });
    } // end ClientService

    // -----------------------------------------------------------------------------------------------------------------

    ClientService.prototype._bindEventHandlers = function()
    {
        this.socket.on('player joined', this.handlePlayerJoined.bind(this));
        this.socket.on('player left', this.handlePlayerLeft.bind(this));
        this.socket.on('spectator joined', this.handleSpectatorJoined.bind(this));
        this.socket.on('spectator left', this.handleSpectatorLeft.bind(this));
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

    ClientService.prototype.handlePlayerJoined = function()
    {

    }; // end handlePlayerJoined

    ClientService.prototype.handlePlayerLeft = function()
    {

    }; // end handlePlayerLeft

    ClientService.prototype.handleSpectatorJoined = function()
    {

    }; // end handleSpectatorJoined

    ClientService.prototype.handleSpectatorLeft = function()
    {

    }; // end handleSpectatorLeft

    return new ClientService();
} // end ClientServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.services').service('ClientService', [
    '$cookieStore',
    'SocketService',
    ClientServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ClientService
//
// @module client.js
// ---------------------------------------------------------------------------------------------------------------------

function ClientServiceFactory($cookieStore, $location, socket)
{
    function ClientService()
    {
        this.events = [];
        this.responses = [];
        var self = this;

        // We only consider ourselves initialized once the server gives us our client details.
        this.initializedPromise = socket.initializedPromise
            .then(function()
            {
                // Check our cookies for our previous values
                var playerName = $cookieStore.get('playerName');
                var secret = $cookieStore.get('secret');

                return socket.emit('client details', {
                    name: playerName,
                    secret: secret
                })
                    .then(function(payload)
                    {
                        self.id = payload.id;
                        self.name = payload.name;
                        self.secret = payload.secret;
                        self.game = payload.game;

                        // Save the details
                        $cookieStore.put('playerName', payload.name);
                        $cookieStore.put('secret', payload.secret);
                    });
            })
            .then(function()
            {
                if(self.game)
                {
                    $location.path('/game/' + self.game.id);
                } // end if
            });
    } // end ClientService

    ClientService.prototype = {
        get game() {
            return this._game;
        },
        set game(val) {
            this._game = val;

            console.log('setting game:', val);

            // If we are setting a game object, it's time to do some work to it.
            if(this._game)
            {
                this._game.submittedResponses = this._game.submittedResponses || [];
                this._game.players = this._game.players || [];
                this._game.spectators = this._game.spectators || [];

                if(!this._game.humanPlayers)
                {
                    Object.defineProperty(this._game, 'humanPlayers', {
                        get: function()
                        {
                            return _.filter(this.players, function(player)
                            {
                                return player.type != 'bot';
                            });
                        }
                    });
                } // end if
            } // end if

            // Process any waiting events
            this.processEvents();
        } // end set game
    }; // end prototype

    // -----------------------------------------------------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------------------------------------------------

    ClientService.prototype.rename = function(name)
    {
        var self = this;
        return this.initializedPromise
            .then(function()
            {
                return socket.emit('client rename', name)
                    .then(function()
                    {
                        self.name = name;
                        $cookieStore.put('playerName', name);
                    });
            });
    }; // end rename

    // -----------------------------------------------------------------------------------------------------------------

    ClientService.prototype.buildEventHandler = function(callback)
    {
        return function()
        {
            if(this.game)
            {
                callback.apply(this, arguments)
            }
            else if(!this.leaving)
            {
                this.events.push({ callback: callback, args: arguments });
            } // end if
        }.bind(this);
    }; // end _buildEventHandler

    ClientService.prototype.processEvents = function()
    {
        var self = this;
        _.each(this.events, function(event)
        {
            event.callback.apply(self, event.args);
        });

        // Clear the events
        this.events = [];
    }; // end _processEvents

    // -----------------------------------------------------------------------------------------------------------------

    return new ClientService();
} // end ClientServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.services').service('ClientService', [
    '$cookieStore',
    '$location',
    'SocketService',
    ClientServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
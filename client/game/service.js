// ---------------------------------------------------------------------------------------------------------------------
// GameService
//
// @module game.js
// ---------------------------------------------------------------------------------------------------------------------

function GameServiceFactory($interval, _, socket)
{
    function GameService()
    {
        var self = this;
        this.games = [];

        // Get an initial list of games
        this.listGames();

        // Schedule a games list refresh ever two minutes
        $interval(function()
        {
            self.listGames();
        }, 120000);
    } // end GameService

    GameService.prototype = {
        get recentGames()
        {
            return _.first(_.sortBy(this.games, 'created'), 5).reverse();
        }
    }; // end prototype

    GameService.prototype.listGames = function()
    {
        var self = this;
        return socket.emit('list games')
            .then(function(payload)
            {
                self.games = payload.games;
                return payload.games;
            });
    }; // end listGames

    GameService.prototype.createGame = function(name)
    {
        var self = this;
        return socket.emit('new game', name)
            .then(function(payload)
            {
                self.games.push(payload.game);
                return payload.game;
            });
    }; // end createGame

    return new GameService();
} // end GameServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.services').service('GameService', [
    '$interval',
    'lodash',
    'SocketService',
    GameServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
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
                self.currentGame = payload.game;
                self.games.push(self.currentGame);
            });
    }; // end createGame

    GameService.prototype.addDeck = function(deck)
    {
        var self = this;
        this.currentGame.decks = this.currentGame.decks || {};
        this.currentGame.decks[deck.code] = deck;

        return socket.emit('add deck', deck.code)
            .then(function(payload)
            {
                //TODO: Handle the case where the server tells us no.

                if(self.currentGame.decks[deck.code])
                {
                    self.currentGame.decks[deck.code] = payload.deck;
                } // end if

                console.log('deck added.');
            });
    }; // end addDeck

    GameService.prototype.removeDeck = function(deck)
    {
        delete this.currentGame.decks[deck.code];

        return socket.emit('remove deck', deck.code)
            .then(function(payload)
            {
                //TODO: Handle the case where the server tells us no.

                console.log('deck deleted.');
            });
    }; // end addDeck

    GameService.prototype.startGame = function()
    {
        console.log('starting game...');
        return socket.emit('start game');
    }; // end startGame

    GameService.prototype.addBot = function(name)
    {
        var self = this;
        return socket.emit('add bot', name)
            .then(function(payload)
            {
                self.currentGame.players.push(payload.bot);
                console.log('bot added.');
            });
    }; // end addBot

    GameService.prototype.removeBot = function(id)
    {
        console.log('removing bot...');
        var self = this;
        return socket.emit('remove bot', id)
            .then(function(payload)
            {
                //TODO: Handle the case where the server tells us no.

                _.remove(self.currentGame.players, { id: id });
                console.log('removed bot');
            });
    }; // end removeBot

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
// ---------------------------------------------------------------------------------------------------------------------
// NewGameController
//
// @module new.js
// ---------------------------------------------------------------------------------------------------------------------

function NewGameController($scope, socket, gameSvc)
{
    $scope.decks = {};

    $scope.createGame = function(name)
    {
        gameSvc.createGame(name)
            .then(function(game)
            {
                $scope.game = game;
            });
    }; // end createGame

    $scope.searchDecks = function(query)
    {
        socket.emit('search decks', query)
            .then(function(payload)
            {
                console.log('decks:', payload.decks);
                $scope.decks = payload.decks;
            });
    }; // end searchDecks

    // Start off with a call to searchDecks
    $scope.searchDecks();
} // end NewGameController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.controllers').controller('NewGameController', [
    '$scope',
    'SocketService',
    'GameService',
    NewGameController
]);

// ---------------------------------------------------------------------------------------------------------------------
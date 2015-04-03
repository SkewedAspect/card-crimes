// ---------------------------------------------------------------------------------------------------------------------
// GameController
//
// @module game.js
// ---------------------------------------------------------------------------------------------------------------------

function GameController($scope, $http, $routeParams, $modal, Game, socketSvc)
{
    $scope.gameTemplate = '/pages/game/spectator.html';

    // Get the game's current state
    $http.get('/game/' + $routeParams.id)
        .success(function(game)
        {
            console.log('got game:', game);
            $scope.game = new Game(game);

            socketSvc.emit('watch game', $routeParams.id);
        });

    // When our scope is destroyed, we need to stop listening for the game's events.
    $scope.$on('$destroy', function()
    {
        socketSvc.emit('unwatch game', $routeParams.id);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Functions
    //------------------------------------------------------------------------------------------------------------------

    $scope.join = function()
    {
        $scope.game.join();
    }; // end join

} // end GameController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.controllers').controller('GameController', [
    '$scope',
    '$http',
    '$routeParams',
    '$modal',
    'GameFactory',
    'SocketService',
    GameController
]);

// ---------------------------------------------------------------------------------------------------------------------
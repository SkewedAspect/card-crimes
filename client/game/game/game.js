// ---------------------------------------------------------------------------------------------------------------------
// GameController
//
// @module game.js
// ---------------------------------------------------------------------------------------------------------------------

function GameController($scope, $routeParams, gameSvc)
{
    // Defined scope properties
    Object.defineProperty($scope, 'game', {
        get: function()
        {
            return gameSvc.currentGame;
        }
    });

    // If the game service already has it's current game set correctly, then we implicitly are being told we're joining
    // as a player. If it's set to anything other than our current game, we join as a spectator.
    $scope.isPlayer = ((gameSvc.currentGame || {}).id == $routeParams.id);

    // Actually join the game.
    gameSvc.joinGame($scope.isPlayer, $routeParams.id);

    // Listen for the scope to be destroyed, and leave the game once that happens
    $scope.$on('$destroy', function()
    {
        gameSvc.leaveGame(gameSvc.currentGame.id);
    });
} // end GameController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.controllers').controller('GameController', [
    '$scope',
    '$routeParams',
    'GameService',
    GameController
]);

// ---------------------------------------------------------------------------------------------------------------------
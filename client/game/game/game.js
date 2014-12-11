// ---------------------------------------------------------------------------------------------------------------------
// GameController
//
// @module game.js
// ---------------------------------------------------------------------------------------------------------------------

function GameController($scope, $routeParams, $modal, socket, gameSvc)
{
    // Defined scope properties
    Object.defineProperty($scope, 'game', {
        get: function()
        {
            return gameSvc.currentGame;
        }
    });

    // The definition for the pause modal
    var pauseModalDef = {
        templateUrl: 'pauseModal.html',
        size: 'md',
        backdrop: 'static'
    };

    // The pause modal
    var pauseModal = undefined;

    // -----------------------------------------------------------------------------------------------------------------
    // Setup
    // -----------------------------------------------------------------------------------------------------------------

    // If the game service already has it's current game set correctly, then we implicitly are being told we're joining
    // as a player. If it's set to anything other than our current game, we join as a spectator.
    $scope.isPlayer = ((gameSvc.currentGame || {}).id == $routeParams.id);

    // Determine which template we should include
    $scope.gameTemplate = $scope.isPlayer ? '/game/game/player.html' : '/game/game/spectator.html';

    // Actually join the game.
    gameSvc.joinGame($scope.isPlayer, $routeParams.id);

    // -----------------------------------------------------------------------------------------------------------------
    // Watches
    // -----------------------------------------------------------------------------------------------------------------

    $scope.$watch('game.state', function(state)
    {
        console.log('game state:', state);

        switch(state)
        {
            case 'initial':
            case 'paused':
                pauseModal = $modal.open(pauseModalDef);
                break;

            default:
                if(pauseModal)
                {
                    pauseModal.close('unpaused');
                    pauseModal = undefined;
                } // end if
                break;
        } // end state
    });

    // -----------------------------------------------------------------------------------------------------------------
    // Event Handlers
    // -----------------------------------------------------------------------------------------------------------------

    // Listen for the scope to be destroyed, and leave the game once that happens
    $scope.$on('$destroy', function()
    {
        if(pauseModal)
        {
            pauseModal.close('unpaused');
            pauseModal = undefined;
        } // end if

        if(gameSvc.currentGame)
        {
            gameSvc.leaveGame(gameSvc.currentGame.id);
        } // end if
    });
} // end GameController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.controllers').controller('GameController', [
    '$scope',
    '$routeParams',
    '$modal',
    'SocketService',
    'GameService',
    GameController
]);

// ---------------------------------------------------------------------------------------------------------------------
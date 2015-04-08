// ---------------------------------------------------------------------------------------------------------------------
// GameController
//
// @module game.js
// ---------------------------------------------------------------------------------------------------------------------

function GameController($scope, $http, $routeParams, $modal, Game, socketSvc)
{
    var pauseModal = undefined;

    Object.defineProperties($scope, {
        gameTemplate: {
            get: function()
            {
                var template = '/pages/game/spectator.html';
                if($scope.game && $scope.game.isPlayer())
                {
                    template = '/pages/game/player.html'
                } // end if

                return template;
            }
        }
    });

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
    // Watches
    //------------------------------------------------------------------------------------------------------------------

    $scope.$watch('game.state', function(state, oldState)
    {
        // Check to see if there's something we need to do to transition from the previous state
        switch(oldState)
        {
            case 'initial':
            case 'paused':
                if(pauseModal)
                {
                    pauseModal.dismiss('unpaused');
                } // end if

                break;
        } // end switch

        // Now, check to see if there's something we need to do with the new state
        switch(state)
        {
            case 'initial':
            case 'paused':
                pauseModal = $modal.open({
                    templateUrl: 'pauseModal.html',
                    size: 'md',
                    scope: $scope,
                    backdrop: 'static'
                });
                break;
        } // end switch
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
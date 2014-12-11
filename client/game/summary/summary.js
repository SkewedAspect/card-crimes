// ---------------------------------------------------------------------------------------------------------------------
// GameSummary
//
// @module summary.js
// ---------------------------------------------------------------------------------------------------------------------

function GameSummaryFactory($location, _, gameSvc)
{
    function GameSummaryController($scope)
    {
        $scope.decksNotEmpty = function()
        {
            return !_.isEmpty($scope.game.decks);
        }; // end decksNotEmpty

        $scope.join = function(isPlayer)
        {
            if(isPlayer)
            {
                // When we join a game, if we already have our game correctly set, we assume we're joining as a player.
                gameSvc.setCurrentGame($scope.game.id);
            } // end if

            $location.path('/game/' + $scope.game.id);
        }; // end join
    } // end GameSummaryController

    return {
        restrict: 'E',
        scope: {
            game: "="
        },
        templateUrl: "/game/summary/summary.html",
        controller: ['$scope', GameSummaryController],
        replace: true
    };
} // end GameSummaryFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.directives').directive('gameSummary', [
    '$location',
    'lodash',
    'GameService',
    GameSummaryFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
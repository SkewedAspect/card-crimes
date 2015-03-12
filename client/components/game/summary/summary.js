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
            gameSvc.joinGame(isPlayer, $scope.game.id)
                .then(function()
                {
                    $location.path('/game/' + $scope.game.id);
                });
        }; // end join
    } // end GameSummaryController

    return {
        restrict: 'E',
        scope: {
            game: "="
        },
        templateUrl: "/components/game/summary/summary.html",
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
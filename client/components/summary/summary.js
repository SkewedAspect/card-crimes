// ---------------------------------------------------------------------------------------------------------------------
// GameSummary
//
// @module summary.js
// ---------------------------------------------------------------------------------------------------------------------

function GameSummaryFactory($location, _, socketSvc)
{
    function GameSummaryController($scope)
    {
        $scope.decksNotEmpty = function()
        {
            return !_.isEmpty($scope.game.decks);
        }; // end decksNotEmpty

        $scope.join = function(isPlayer)
        {
            socketSvc.emit('join game', $scope.game.id);
            $location.path('/game/' + $scope.game.id);
        }; // end join
    } // end GameSummaryController

    return {
        restrict: 'E',
        scope: {
            game: "="
        },
        templateUrl: "/components/summary/summary.html",
        controller: ['$scope', GameSummaryController],
        replace: true
    };
} // end GameSummaryFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.directives').directive('gameSummary', [
    '$location',
    'lodash',
    'SocketService',
    GameSummaryFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// GameSummary
//
// @module summary.js
// ---------------------------------------------------------------------------------------------------------------------

function GameSummaryFactory(_)
{
    function GameSummaryController($scope)
    {
        $scope.decksNotEmpty = function()
        {
            return !_.isEmpty($scope.game.decks);
        }; // end decksNotEmpty
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
    'lodash',
    GameSummaryFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
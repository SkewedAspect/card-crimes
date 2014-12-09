// ---------------------------------------------------------------------------------------------------------------------
// GameSummary
//
// @module summary.js
// ---------------------------------------------------------------------------------------------------------------------

function GameSummaryFactory()
{
    function GameSummaryController($scope)
    {
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

angular.module('card-crimes.directives').directive('gameSummary', [GameSummaryFactory]);

// ---------------------------------------------------------------------------------------------------------------------
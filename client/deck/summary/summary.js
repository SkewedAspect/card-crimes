// ---------------------------------------------------------------------------------------------------------------------
// DeckSummary
//
// @module summary
// ---------------------------------------------------------------------------------------------------------------------

function DeckSummaryFactory()
{
    function DeckSummaryController($scope)
    {
    } // end DeckSummaryController

    return {
        restrict: 'E',
        scope: {
            deck: '='
        },
        templateUrl: "/deck/summary/summary.html",
        controller: ['$scope', DeckSummaryController],
        replace: true
    };
} // end DeckSummaryFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.directives').directive('deckSummary', [DeckSummaryFactory]);

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// DeckSummary
//
// @module summary
// ---------------------------------------------------------------------------------------------------------------------

function DeckSummaryFactory(_)
{
    function DeckSummaryController($scope)
    {
        $scope.rating = ['empty', 'empty', 'empty', 'empty', 'empty'];

        // Calculate rating
        var rating = parseFloat($scope.deck.rating);
        var wholeRating = Math.floor(rating);
        var fractionalRating = rating - wholeRating;

        // Fill the whole ratings
        _.each(_.range(wholeRating), function(num, index)
        {
            $scope.rating[index] = 'full';
        });

        // Fill in the fractional rating
        if(fractionalRating > .3 && fractionalRating <=.7)
        {
            $scope.rating[wholeRating] = 'half';
        }
        else if(fractionalRating > .7)
        {
            $scope.rating[wholeRating] = 'full';
        } // end if
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

angular.module('card-crimes.directives').directive('deckSummary', [
    'lodash',
    DeckSummaryFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
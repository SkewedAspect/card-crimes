// ---------------------------------------------------------------------------------------------------------------------
// DeckSummary
//
// @module summary
// ---------------------------------------------------------------------------------------------------------------------

function DeckSummaryFactory(_)
{
    function DeckSummaryController($scope)
    {
        $scope.full = $scope.full() !== undefined ? $scope.full() : true;
        $scope.rating = ['empty', 'empty', 'empty', 'empty', 'empty'];

        Object.defineProperty($scope, 'selected', {
            get: function()
            {
                return !!(_.find($scope.decks, { code: $scope.deck.code }));
            }
        });

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
        if(fractionalRating >= .3 && fractionalRating <=.7)
        {
            $scope.rating[wholeRating] = 'half';
        }
        else if(fractionalRating > .7)
        {
            $scope.rating[wholeRating] = 'full';
        } // end if

        // -------------------------------------------------------------------------------------------------------------

        $scope.select = function()
        {
            if($scope.selected)
            {
                // Remove ourself from the list of decks passed in.
                _.remove($scope.decks, { code: $scope.deck.code });
            }
            else
            {
                // Add ourself to the list of decks passed in.
                $scope.decks.push($scope.deck);
            } // end if
        }; // end select
    } // end DeckSummaryController

    return {
        restrict: 'E',
        scope: {
            deck: '=',
            decks: '=',
            full: '&'
        },
        templateUrl: "/components/deck/summary/summary.html",
        controller: ['$scope', DeckSummaryController],
        replace: true
    };
} // end DeckSummaryFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.directives').directive('deckSummary', [
    'lodash',
    'GameService',
    DeckSummaryFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
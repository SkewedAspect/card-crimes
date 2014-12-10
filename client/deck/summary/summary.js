// ---------------------------------------------------------------------------------------------------------------------
// DeckSummary
//
// @module summary
// ---------------------------------------------------------------------------------------------------------------------

function DeckSummaryFactory(_, gameSvc)
{
    function DeckSummaryController($scope)
    {
        $scope.rating = ['empty', 'empty', 'empty', 'empty', 'empty'];

        Object.defineProperty($scope, 'selected', {
            get: function()
            {
                    return $scope.deck.code in (($scope.game || {}).decks || {});
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
                // Remove the deck with the game service
                gameSvc.removeDeck($scope.deck);
            }
            else
            {
                // Select the deck with the game service.
                gameSvc.addDeck($scope.deck);
            } // end if
        }; // end select
    } // end DeckSummaryController

    return {
        restrict: 'E',
        scope: {
            deck: '=',
            game: '='
        },
        templateUrl: "/deck/summary/summary.html",
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
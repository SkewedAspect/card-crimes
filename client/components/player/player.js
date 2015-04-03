// ---------------------------------------------------------------------------------------------------------------------
// Player
//
// @module player.js
// ---------------------------------------------------------------------------------------------------------------------

function PlayerFactory()
{
    function PlayerController($scope)
    {
        $scope.getUserClass = function(playerID)
        {
            if(($scope.game.currentJudge || {}).id == playerID)
            {
                return 'fa-gavel';
            }
            else if($scope.game.hasSubmitted(playerID))
            {
                return 'fa-check text-success'
            }
            else
            {
                return 'fa-spinner fa-spin'
            } // end if
        }; // end getUserClass
    } // end PlayerController

    return {
        restrict: 'E',
        scope: {
            session: '=',
            game: '='
        },
        templateUrl: "/components/player/player.html",
        controller: ['$scope', PlayerController]
    };
} // end PlayerFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.directives').directive('player', [PlayerFactory]);

// ---------------------------------------------------------------------------------------------------------------------
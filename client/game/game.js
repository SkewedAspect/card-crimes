// ---------------------------------------------------------------------------------------------------------------------
// GameController
//
// @module game.js
// ---------------------------------------------------------------------------------------------------------------------

function GameController($scope, $routeParams, $modal, clientSvc, gameSvc)
{
    $scope.selectedCards = [];
    $scope.selectedBlank = 0;

    // Defined scope properties
    Object.defineProperties($scope, {
        game: {
            get: function()
            {
                return gameSvc.currentGame;
            }
        },
        client: {
            get: function()
            {
                return clientSvc;
            }
        },
        submitReady: {
            get: function()
            {
                if($scope.game.currentCall)
                {
                    return $scope.selectedCards.length >= $scope.game.currentCall.numResponses;
                } // end if

                return false;
            }
        }
    });

    // The definition for the pause modal
    var pauseModalDef = {
        templateUrl: 'pauseModal.html',
        size: 'md',
        backdrop: 'static'
    };

    // The pause modal
    var pauseModal = undefined;

    // -----------------------------------------------------------------------------------------------------------------
    // Setup
    // -----------------------------------------------------------------------------------------------------------------

    // If the game service already has it's current game set correctly, then we implicitly are being told we're joining
    // as a player. If it's set to anything other than our current game, we join as a spectator.
    $scope.isPlayer = ((gameSvc.currentGame || {}).id == $routeParams.id);

    // Determine which template we should include
    $scope.gameTemplate = $scope.isPlayer ? '/game/player.html' : '/game/spectator.html';

    // Actually join the game.
    gameSvc.joinGame($scope.isPlayer, $routeParams.id);

    // -----------------------------------------------------------------------------------------------------------------
    // Watches
    // -----------------------------------------------------------------------------------------------------------------

    $scope.$watch('game.state', function(state)
    {
        console.log('game state:', state);

        switch(state)
        {
            case 'initial':
            case 'paused':
                pauseModal = $modal.open(pauseModalDef);
                break;

            default:
                if(pauseModal)
                {
                    pauseModal.close('unpaused');
                    pauseModal = undefined;
                } // end if
                break;
        } // end state
    });

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------

    $scope.hasSubmitted = function(playerID)
    {
        return gameSvc.hasSubmitted(playerID);
    }; // end hasSubmitted

    $scope.getCardText = function(cardID)
    {
        var card = _.find($scope.client.responses, { id: cardID });

        if(card)
        {
            return card.text;
        }
        else
        {
            return '';
        } // end if
    }; // end getCardText

    $scope.selectCard = function(cardID)
    {
        if($scope.selectedCards.indexOf(cardID) == -1)
        {
            if($scope.selectedCards.length < $scope.game.currentCall.numResponses)
            {
                $scope.selectedCards.push(cardID);
            }
            else
            {
                $scope.selectedCards[$scope.selectedBlank] = cardID;
            } // end if
        }
        else
        {
            _.remove($scope.selectedCards, function(card)
            {
                return card == cardID;
            });
        } // end if
    }; // end selectCard

    $scope.submitCards = function()
    {
        console.log('submitting cards!');
        gameSvc.submitResponse($scope.selectedCards);
    }; // end submitCards

    // -----------------------------------------------------------------------------------------------------------------
    // Event Handlers
    // -----------------------------------------------------------------------------------------------------------------

    // Listen for the scope to be destroyed, and leave the game once that happens
    $scope.$on('$destroy', function()
    {
        if(pauseModal)
        {
            pauseModal.close('unpaused');
            pauseModal = undefined;
        } // end if

        if(gameSvc.currentGame)
        {
            gameSvc.leaveGame(gameSvc.currentGame.id);
        } // end if
    });
} // end GameController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.controllers').controller('GameController', [
    '$scope',
    '$routeParams',
    '$modal',
    'ClientService',
    'GameService',
    GameController
]);

// ---------------------------------------------------------------------------------------------------------------------
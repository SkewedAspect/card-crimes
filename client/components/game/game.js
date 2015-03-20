// ---------------------------------------------------------------------------------------------------------------------
// GameController
//
// @module game.js
// ---------------------------------------------------------------------------------------------------------------------

function GameController($scope, $routeParams, $modal, client, gameSvc)
{
    $scope.cards = { selected: [] };
    $scope.response = { selected: undefined };
    $scope.selectedBlank = 0;

    // Defined scope properties
    Object.defineProperties($scope, {
        game: {
            get: function()
            {
                return client.game;
            }
        },
        isPlayer: {
            get: function()
            {
                return !!_.find((client.game || {}).players, { id: client.id });
            }
        },
        isJudge: {
            get: function()
            {
                return ((client.game || {}).currentJudge || {}).id == client.id;
            }
        },
        hasSubmitted: {
            get: function()
            {
                return !!_.find($scope.game.submittedResponses, { player: client.id });
            }
        },
        gameTemplate: {
            get: function()
            {
                return $scope.isPlayer ? '/components/game/player.html' : '/components/game/spectator.html';
            }
        },
        client: {
            get: function()
            {
                return client;
            }
        },
        submitReady: {
            get: function()
            {
                if($scope.game.currentCall)
                {
                    return $scope.cards.selected.length >= $scope.game.currentCall.numResponses;
                } // end if

                return false;
            }
        }
    });

    // The definition for the pause modal
    var pauseModalDef = {
        templateUrl: 'pauseModal.html',
        size: 'md',
        scope: $scope,
        backdrop: 'static'
    };

    // The pause modal
    var pauseModal = undefined;

    // The definition for the winning modal
    var winningModalDef = {
        templateUrl: 'winningModal.html',
        size: 'lg',
        scope: $scope,
        backdrop: 'static'
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Setup
    // -----------------------------------------------------------------------------------------------------------------

    client.initializedPromise
        .then(function()
        {
            // If we don't already have a game set, we join as a spectator
            if(!$scope.game)
            {
                client.joinGamePromise = gameSvc.joinGame($scope.isPlayer, $routeParams.id)
                    .then(function()
                    {
                        if(client.responses.length < 10)
                        {
                            gameSvc.drawCards(10 - client.responses.length)
                        } // end if
                    }); // end then
            } // end if
        }); // end then
    
    // -----------------------------------------------------------------------------------------------------------------
    // Event Handlers
    // -----------------------------------------------------------------------------------------------------------------

    $scope.$on('round over', function(event, response)
    {
        if(!$scope.winningResponse)
        {
            $scope.winningResponse = {
                call: $scope.game.currentCall,
                response: $scope.game.submittedResponses[response.id].cards,
                player: response.player
            };

            var modal = $modal.open(winningModalDef);

            modal.result.then(function()
            {
                $scope.winningResponse = undefined;
            });

            // Hide the dialog after 15 seconds
            setTimeout(function()
            {
                modal.close();
            }, 15000);
        } // end if
    });

    // -----------------------------------------------------------------------------------------------------------------
    // Watches
    // -----------------------------------------------------------------------------------------------------------------

    $scope.$watch('game.state', function(state)
    {
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

    $scope.joinAsPlayer = function()
    {
        gameSvc.joinGame(true, $routeParams.id);
    }; // end joinAsPlayer

    $scope.getUserClass = function(playerID)
    {
        if(($scope.game.currentJudge || {}).id == playerID)
        {
            return 'fa-gavel';
        }
        else if(gameSvc.hasSubmitted(playerID))
        {
            return 'fa-check text-success'
        }
        else
        {
            return 'fa-spinner fa-spin'
        } // end if
    }; // end getUserClass

    $scope.getCardText = function(cardID)
    {
        var card = _.find($scope.client.responses, { id: cardID });

        if(card)
        {
            return card.displayText;
        }
        else
        {
            return '';
        } // end if
    }; // end getCardText

    $scope.selectCard = function(cardID)
    {
        if($scope.cards.selected.indexOf(cardID) == -1)
        {
            if($scope.cards.selected.length < $scope.game.currentCall.numResponses)
            {
                $scope.cards.selected.push(cardID);
            }
            else
            {
                $scope.cards.selected[$scope.selectedBlank] = cardID;
            } // end if
        }
        else
        {
            _.remove($scope.cards.selected, function(card)
            {
                return card == cardID;
            });
        } // end if
    }; // end selectCard

    $scope.selectResponse = function(response)
    {
        if($scope.isJudge)
        {
            if(!$scope.response.selected)
            {
                $scope.cards.selected = response.cards;
                $scope.response.selected = response;
            }
            else
            {
                $scope.cards.selected = [];
                $scope.response.selected = undefined;
            } // end if
        } // end if
    }; // end selectResponse

    $scope.submitCards = function()
    {
        gameSvc.submitResponse($scope.cards.selected)
            .then(function()
            {
                // We need to remove the cards we just submitted
                _.each($scope.cards.selected, function(card)
                {
                    _.remove(client.responses, function(response)
                    {
                        return card == response.id;
                    });
                });

                // We need to draw up to 10.
                gameSvc.drawCards(10 - $scope.client.responses.length);

                // Now we need to clear our selection
                $scope.cards.selected = [];
            });
    }; // end submitCards

    $scope.selectWinningResponse = function()
    {
        if($scope.response.selected)
        {
            gameSvc.selectResponse($scope.response.selected.id)
                .then(function()
                {
                    $scope.cards.selected = [];
                    $scope.response.selected = undefined;
                });
        } // end if
    }; // end selectWinningResponse

    $scope.dismissResponse = function()
    {
        if($scope.response.selected)
        {
            gameSvc.dismissResponse($scope.response.selected.id)
                .then(function()
                {
                    $scope.cards.selected = [];
                    $scope.response.selected = undefined;
                });
        } // end if
    }; // end dismissResponse

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

        if(client.game)
        {
            gameSvc.leaveGame(client.game.id);
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
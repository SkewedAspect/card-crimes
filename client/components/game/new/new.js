// ---------------------------------------------------------------------------------------------------------------------
// NewGameController
//
// @module new.js
// ---------------------------------------------------------------------------------------------------------------------

function NewGameController($scope, $http, $location, Promise, _, socket, client, deckSvc, gameSvc)
{
    $scope.step = 1;
    $scope.searchResults = {};
    $scope.suggested = [];
    $scope.currentPage = 1;
    $scope.visibilityRadio = 'Public';

    Object.defineProperties($scope, {
        currentPage: {
            get: function()
            {
                return $scope.searchResults.page;
            },
            set: function(val)
            {
                console.log('setting page to:', val);
                $scope.searchResults.page = val;
            }
        },
        bots: {
            get: function()
            {
                return _.filter(($scope.game || {}).players, { type: 'bot' });
            }
        },
        gameDecks: {
            get: function()
            {
                return _.sortBy(_.values(($scope.game || {}).decks), 'name');
            }
        },
        game: {
            get: function(){ return client.game; }
        }
    });

    // -----------------------------------------------------------------------------------------------------------------

    $scope.createGame = function()
    {
        gameSvc.createGame($scope.gameName, { visibility: $scope.visibilityRadio})
            .then(function()
            {
                $scope.nextStep();
            })
            .then(function()
            {
                return deckSvc.getSuggested()
                    .then(function(suggested)
                    {
                        $scope.suggested = suggested;
                    });
            })
            .then(function()
            {
                return $scope.searchDecks();
            });
    }; // end createGame

    $scope.searchDecks = function(query)
    {
        $scope.searchResults = {};
        deckSvc.search(query)
            .then(function(results)
            {
                console.log('results:', results);
                $scope.searchResults = results;
            });
    }; // end searchDecks

    $scope.removeDeck = function(deck)
    {
        gameSvc.removeDeck(deck);
    }; // end removeDeck

    $scope.decksEmpty = function()
    {
        return _.isEmpty(($scope.game || {}).decks);
    }; // end decksNotEmpty

    $scope.finishSetup = function()
    {
        gameSvc.startGame()
            .then(function()
            {
                $location.path('/game/' + $scope.game.id);
            });
    }; // end finishSetup

    $scope.addBot = function(name)
    {
        gameSvc.addBot(name)
            .then(function()
            {
                $scope.botName = "";
            });
    }; // end addBot

    $scope.removeBot = function(id)
    {
        gameSvc.removeBot(id);
    }; // end removeBot

    $scope.nextStep = function()
    {
        $scope.step += 1;
    }; // end nextStep;

    $scope.prevStep = function()
    {
        $scope.step = Math.max(1, $scope.step - 1);
    }; // end nextStep;

    // -----------------------------------------------------------------------------------------------------------------

    // Start off with a call to searchDecks
    //$scope.searchDecks();
} // end NewGameController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.controllers').controller('NewGameController', [
    '$scope',
    '$http',
    '$location',
    '$q',
    'lodash',
    'SocketService',
    'ClientService',
    'DeckService',
    'GameService',
    NewGameController
]);

// ---------------------------------------------------------------------------------------------------------------------
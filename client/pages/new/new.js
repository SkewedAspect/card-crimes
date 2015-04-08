// ---------------------------------------------------------------------------------------------------------------------
// NewGameController
//
// @module new.js
// ---------------------------------------------------------------------------------------------------------------------

function NewGameController($scope, $http, $location, _, deckSvc, socketSvc)
{
    $scope.newGame = {
        name: '',
        options: { visibility: 'Public', bots: [] },
        decks: []
    };

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
                $scope.searchResults.page = val;
            }
        }
    });

    // -----------------------------------------------------------------------------------------------------------------

    $scope.startCreation = function()
    {
        // Start populating our list of decks, and move on.
        $scope.searchDecks();
        $scope.nextStep();
        deckSvc.getSuggested()
            .then(function(suggested)
            {
                $scope.suggested = suggested;

            });
    }; // end startCreation

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
        _.remove($scope.newGame.decks, { code: deck.code });
    }; // end removeDeck

    $scope.decksEmpty = function()
    {
        return _.isEmpty($scope.newGame.decks);
    }; // end decksNotEmpty

    $scope.finishSetup = function()
    {
        // Since the server expects our decks as a list of strings, we pull some crafty lodash magic, and make it so.
        var game = _.defaults({
            decks: _.map($scope.newGame.decks, 'code')
        }, $scope.newGame);

        // Tell the server to create a new game!
        $http.post('/game', game)
            .success(function(game)
            {
                console.log('game:', game);
                socketSvc.emit('join game', game.id);
                $location.path('/game/' + game.id);
            });
    }; // end finishSetup

    $scope.addBot = function(name)
    {
        name = name || "Rando Cardrissian";
        $scope.newGame.options.bots.push(name);
    }; // end addBot

    $scope.removeBot = function(name)
    {
        _.remove($scope.newGame.options.bots, function(value){ return value === name; });
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
    'lodash',
    'DeckService',
    'SocketService',
    NewGameController
]);

// ---------------------------------------------------------------------------------------------------------------------
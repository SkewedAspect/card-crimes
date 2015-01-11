// ---------------------------------------------------------------------------------------------------------------------
// NewGameController
//
// @module new.js
// ---------------------------------------------------------------------------------------------------------------------

function NewGameController($scope, $location, _, socket, client, gameSvc)
{
    $scope.step = 1;
    $scope.decks = {};
    $scope.currentPage = 1;
    $scope.visibilityRadio = 'Public';

    Object.defineProperties($scope, {
        totalPages: {
            get: function()
            {
                return Math.ceil($scope.decks.count / 20) || 0;
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

    $scope.$watch('currentPage', function()
    {
        var offset = ($scope.currentPage - 1) * 20;
        $scope.searchDecks($scope.query, offset);
    });

    // -----------------------------------------------------------------------------------------------------------------

    $scope.createGame = function()
    {
        gameSvc.createGame({ gameName: $scope.gameName, visibility: $scope.visibilityRadio})
            .then(function()
            {
                $scope.nextStep();
            });
    }; // end createGame

    $scope.searchDecks = function(query, offset)
    {
        offset = offset || 0;

        // Store the query for pagination later
        $scope.query = query;

        // Search for the decks requested
        socket.emit('search decks', query, offset)
            .then(function(payload)
            {
                $scope.decks = payload.decks;
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
    $scope.searchDecks();
} // end NewGameController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.controllers').controller('NewGameController', [
    '$scope',
    '$location',
    'lodash',
    'SocketService',
    'ClientService',
    'GameService',
    NewGameController
]);

// ---------------------------------------------------------------------------------------------------------------------
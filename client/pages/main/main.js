// ---------------------------------------------------------------------------------------------------------------------
// MainController
//
// @module main.js
// ---------------------------------------------------------------------------------------------------------------------

function MainController($scope, $http)
{
    $scope.currentGames = [];

    //TODO: Listen for new game creation, and update our list.

    // Get the list of recent games
    $http.get('/game')
        .success(function(games)
        {
            $scope.currentGames = games.slice(0, 5);
        });
} // end MainController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.controllers').controller('MainController', [
    '$scope',
    '$http',
    MainController
]);

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// BrowseGameController
//
// @module browse.js
// ---------------------------------------------------------------------------------------------------------------------

function BrowseGameController($scope, gameSvc)
{
    Object.defineProperty($scope, 'games', {
        get: function(){ return gameSvc.games; }
    });

    // Always refresh our list of games when the page is loaded.
    gameSvc.listGames();
} // end BrowseGameController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.controllers').controller('BrowseGameController', [
    '$scope',
    'GameService',
    BrowseGameController
]);

// ---------------------------------------------------------------------------------------------------------------------
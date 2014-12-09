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
} // end BrowseGameController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.controllers').controller('BrowseGameController', [
    '$scope',
    'GameService',
    BrowseGameController
]);

// ---------------------------------------------------------------------------------------------------------------------
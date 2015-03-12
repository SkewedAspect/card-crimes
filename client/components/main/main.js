// ---------------------------------------------------------------------------------------------------------------------
// MainController
//
// @module main.js
// ---------------------------------------------------------------------------------------------------------------------

function MainController($scope, gameSvc)
{
    Object.defineProperty($scope, 'recentGames', {
        get: function(){ return gameSvc.recentGames; }
    });
} // end MainController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.controllers').controller('MainController', [
    '$scope',
    'GameService',
    MainController
]);

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// MainController
//
// @module main.js
// ---------------------------------------------------------------------------------------------------------------------

function MainController($scope, gameSvc)
{
    Object.defineProperty($scope, 'currentGames', {
        get: function(){ return gameSvc.currentGames; }
    });
} // end MainController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.controllers').controller('MainController', [
    '$scope',
    'GameService',
    MainController
]);

// ---------------------------------------------------------------------------------------------------------------------
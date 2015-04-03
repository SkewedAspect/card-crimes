// ---------------------------------------------------------------------------------------------------------------------
// BrowseGameController
//
// @module browse.js
// ---------------------------------------------------------------------------------------------------------------------

function BrowseGameController($scope, $http, _)
{
    $scope.query = undefined;
    $scope.games = [];
    $scope.searching = false;

    $scope.search = function()
    {
        $scope.searching = true;
        var name = _.isEmpty($scope.query) ? undefined : $scope.query;
        $http.get('/game', { params: { name: name } })
            .success(function(games)
            {
                $scope.games = games;
                $scope.searching = false;
            });
    }; // end search

    // Populate with an initial search
    $scope.search();
} // end BrowseGameController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.controllers').controller('BrowseGameController', [
    '$scope',
    '$http',
    'lodash',
    BrowseGameController
]);

// ---------------------------------------------------------------------------------------------------------------------
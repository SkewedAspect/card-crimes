// ---------------------------------------------------------------------------------------------------------------------
// SiteHeader
//
// @module header.js
// ---------------------------------------------------------------------------------------------------------------------

function SiteHeaderFactory(client)
{
    function SiteHeaderController($scope, $timeout)
    {
        $scope.isCollapsed = true;
        $scope.client = client;
        $scope.renaming = false;

        $scope.rename = function(name)
        {
            client.rename(name)
                .then(function()
                {
                    $scope.renaming = false;
                });
        }; // end rename
    } // end SiteHeaderController

    return {
        restrict: 'E',
        scope: true,
        templateUrl: "/header/header.html",
        controller: ['$scope', '$timeout', SiteHeaderController],
        replace: true
    };
} // end SiteHeaderFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.directives').directive('siteHeader', [
    'ClientService',
    SiteHeaderFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
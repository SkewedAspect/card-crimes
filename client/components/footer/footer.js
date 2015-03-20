// ---------------------------------------------------------------------------------------------------------------------
// SiteFooter
//
// @module footer.js
// ---------------------------------------------------------------------------------------------------------------------

function SiteFooterFactory($http)
{
    function SiteFooterController($scope)
    {
        $http.head('/')
            .then(function(response)
            {
                $scope.version = response.headers('Version');
            });
    } // end SiteFooterController

    return {
        restrict: 'E',
        scope: true,
        templateUrl: "/components/footer/footer.html",
        controller: ['$scope', SiteFooterController]
    };
} // end SiteFooterFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.directives').directive('siteFooter', [
    '$http',
    SiteFooterFactory
]);

// ---------------------------------------------------------------------------------------------------------------------
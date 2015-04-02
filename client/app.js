// ---------------------------------------------------------------------------------------------------------------------
// Main Card-crimes app.
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes', [
        'ngRoute',

        'lodash',
        'socket.io',
        'ui.bootstrap',
        'ipCookie',
        'djds4rce.angular-socialshare',

        'card-crimes.services',
        'card-crimes.controllers',
        'card-crimes.directives'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', { templateUrl: '/components/main/main.html', controller: 'MainController' })
            .when('/game', { templateUrl: '/components/game/browse/browse.html', controller: 'BrowseGameController' })
            .when('/game/new', { templateUrl: '/components/game/new/new.html', controller: 'NewGameController' })
            .when('/game/:id', { templateUrl: '/components/game/game.html', controller: 'GameController' })
            .otherwise({redirectTo: '/'});
    }])
    .run(function($FB){ $FB.init('1624511164452269'); })
    .filter('renderResponse', function()
    {
        return function(responseText)
        {
            // Strip trailing periods
            var re = /.$/;
            return responseText.replace(re, '');
        }; // end renderResponse
    });

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.services', []);
angular.module('card-crimes.controllers', []);
angular.module('card-crimes.directives', []);
angular.module('card-crimes.directives');

// ---------------------------------------------------------------------------------------------------------------------
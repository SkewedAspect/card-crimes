// ---------------------------------------------------------------------------------------------------------------------
// Main Card-crimes app.
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes', [
        'ngRoute',
        'ngCookies',

        'socket.io',
        'ui.bootstrap',

        'card-crimes.services',
        'card-crimes.controllers',
        'card-crimes.directives'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', { templateUrl: '/main/main.html', controller: 'MainController' })
            .when('/game/new', { templateUrl: '/game.new.html', controller: 'NewGameController' })
            .when('/game/:id', { templateUrl: '/game.html', controller: 'GameController' })
            .otherwise({redirectTo: '/'});
    }]);

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.services', []);
angular.module('card-crimes.controllers', []);
angular.module('card-crimes.directives', []);

// ---------------------------------------------------------------------------------------------------------------------
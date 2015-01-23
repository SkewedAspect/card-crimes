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

        'card-crimes.services',
        'card-crimes.controllers',
        'card-crimes.directives'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', { templateUrl: '/main/main.html', controller: 'MainController' })
            .when('/game', { templateUrl: '/game/browse/browse.html', controller: 'BrowseGameController' })
            .when('/game/new', { templateUrl: '/game/new/new.html', controller: 'NewGameController' })
            .when('/game/:id', { templateUrl: '/game/game.html', controller: 'GameController' })
            .otherwise({redirectTo: '/'});
    }])
    .filter('renderResponse', function()
    {
        return function(responseText)
        {
            if(responseText[responseText.length - 1] != '.')
            {
                responseText += '.';
            } // end if

            return responseText;
        }; // end renderResponse
    });

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.services', []);
angular.module('card-crimes.controllers', []);
angular.module('card-crimes.directives', []);

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// Wrapper modules for third-party libraries.
//
// @module libs.js
// ---------------------------------------------------------------------------------------------------------------------
/* global angular: true */

angular.module('socket.io', []).factory('io', function($window) { return $window.io; });
angular.module('lodash', []).factory('lodash', function($window) { return $window._; });

// ---------------------------------------------------------------------------------------------------------------------

'use strict';

angular.module('projectsApp').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // For unmatched routes
    $urlRouterProvider.otherwise('/kasu/map');

    // Application routes
    $stateProvider
      .state('main', {
        abstract: true,
        url: '/kasu',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('main.map', {
        url: '/map',
        templateUrl: 'app/map/map.html',
        controller: 'MapCtrl'
      });
  }
]);

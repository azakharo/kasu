'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope) {
    $scope.showSidebar = window.innerWidth >= 768;

    $scope.onSidebarToggleClick = function () {
      $scope.showSidebar = !$scope.showSidebar;
    };

    $scope.sidebarItems = [
      {
        state: 'main.map',
        title: 'Карта'
      },
      {
        state: 'main.test',
        title: 'Тест'
      }
    ];

  });

'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope) {
    $scope.sidebarToggle = 0;

    $scope.onSidebarToggleClick = function () {
      $("#wrapper").toggleClass("toggled");
      $scope.sidebarToggle += 1;
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

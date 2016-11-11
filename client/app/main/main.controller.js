'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope, $timeout) {

    $scope.onSidebarToggleClick = function () {
      $("#wrapper").toggleClass("toggled");
      $timeout(function () {
        if ($("#wrapper").hasClass("toggled")) {
          mymap.invalidateSize();
        }
      }, 600);
    };

  });

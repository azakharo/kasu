'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope, $rootScope, $timeout) {
    $rootScope.isSidebarShown = false; // window.innerWidth >= 768;
    $rootScope.isGettingData = false;

    $scope.onSidebarToggleClick = function () {
      $rootScope.isSidebarShown = !$rootScope.isSidebarShown;
    };

    $scope.sidebarItems = [
      {
        state: 'main.map',
        title: 'Карта'
      },
      {
        state: 'main.test',
        title: 'Тест'
      },
      {
        state: 'main.moscow',
        title: 'Москва'
      }
    ];

    const BRAND_SELECTOR = 'a.navbar-brand > img';
    const BRAND_ANIM_CLASSES = 'animated flipInX';
    $scope.animateBrand = function() {
      $(BRAND_SELECTOR).removeClass(BRAND_ANIM_CLASSES);
      $timeout(function () {
        $(BRAND_SELECTOR).addClass(BRAND_ANIM_CLASSES);
      }, 0);
    };

    $scope.onSidebarItemClick = function () {
      $scope.animateBrand();
    };

  });

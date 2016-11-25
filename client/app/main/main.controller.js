'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope, $timeout) {
    $scope.isSidebarPinned = false;
    $scope.showSidebar = false; // window.innerWidth >= 768;

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
      if (!$scope.isSidebarPinned) {
        $scope.showSidebar = false;
      }
    };

    $scope.onSidebarPinBtnClick = function () {
      $scope.isSidebarPinned = !$scope.isSidebarPinned;
      if (!$scope.isSidebarPinned) { // if became unpinned
        $scope.showSidebar = false;
      }
    };

  });

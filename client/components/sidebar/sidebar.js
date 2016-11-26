'use strict';

angular.module('projectsApp')
  .component('sidebar', {
    templateUrl: 'components/sidebar/sidebar.html',
    controller: 'SidebarCtrl',
    bindings: {
      menuItems: '=',
      onMenuItemClick: '&'
    }
  })
  .controller('SidebarCtrl', function ($rootScope) {
    this.rootScope = $rootScope;
    this.isPinned = false;

    this.onToggleClick = function () {
      $rootScope.isSidebarShown = !$rootScope.isSidebarShown;
    };

    this.onItemClick = function (item) {
      if (!this.isPinned) {
        $rootScope.isSidebarShown = false;
      }
      this.onMenuItemClick(item);
    };

    this.onPinClick = function () {
      this.isPinned = !this.isPinned;
      if (!this.isPinned) { // if became unpinned
        $rootScope.isSidebarShown = false;
      }
    };

  });

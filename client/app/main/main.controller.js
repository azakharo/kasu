'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope, $timeout) {
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


    /////////////////////////////////////////////////////////////////
    // Shared code (for maps)

    $scope.addLayer = function(name, geojson, map, layersCtrl) {
      let layer = L.geoJSON(geojson, {
        onEachFeature: function (feature, layer) {
          layer.bindPopup("<i>" + feature.properties.name + "</i>");
          layer.on({
            mouseover: function (e) {
              e.target.openPopup();
            },
            mouseout: function (e) {
              e.target.closePopup();
            }
          });
        }
      });
      layer.addTo(map);
      layersCtrl.addOverlay(layer, name);
    };

    // Shared code (for maps)
    /////////////////////////////////////////////////////////////////

  });

'use strict';

angular.module('projectsApp')
  .controller('MoscowCtrl', function ($scope, $rootScope, $timeout, $http) {
    //*******************************************
    // Start up code

    let mymap = null;
    let layersCtrl = null;
    const DEFAULT_LOCATION = {
      lat: 55.754106,
      lon: 37.620386
    };
    const DEFAULT_ZOOM = 11;

    drawMap(DEFAULT_LOCATION);

    // Start up code
    //*******************************************


    ////////////////////////////////////////////////
    // Implementation

    function drawMap(location) {
      $rootScope.isGettingData = true;

      let mapOptions = {
        zoom: DEFAULT_ZOOM,
        attributionControl: false,
        preferCanvas: true
      };
      if (location) {
        mapOptions.center = [location.lat, location.lon];
      }

      const TILE_URL_TEMPL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
      const TILE_ACCESS_TOKEN = 'pk.eyJ1IjoiYXpha2hhcm8iLCJhIjoiY2l1cDhvMnY4MDAxMzJvcGt1ZmVyaGVkYSJ9.N1F11vuDHwrrkuEXjBSOeA';

      // Base layers
      let streetTiles = L.tileLayer(TILE_URL_TEMPL, {
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: TILE_ACCESS_TOKEN
      });
      let grayscaleTiles = L.tileLayer(TILE_URL_TEMPL, {
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: TILE_ACCESS_TOKEN
      });

      // Create map
      //mapOptions.layers = [streetTiles, mushrooms, powerPoints];
      mapOptions.layers = [streetTiles];
      mymap = L.map($('.moscow-map')[0], mapOptions);

      // Layer Control
      const baseMaps = {
        "Карта дорог": streetTiles,
        "Базовая карта": grayscaleTiles
      };

      layersCtrl = L.control.layers(baseMaps).addTo(mymap);

      $timeout(function () {
        mymap.invalidateSize();
      }, 100);

      loadLayers(mymap, layersCtrl);
    }


    //===========================================
    // GeoJSON layers

    function loadLayers(map, layersCtrl) {
      //log('load layers');

      const layerInfos = [
        {
          name: 'Административные округа',
          geoJsonFname: 'ao.geojson',
          fillColor: "#ff7800"
        },
        {
          name: 'Муниципальные образования',
          geoJsonFname: 'mo.geojson',
          fillColor: "#ff78a0"
        }
      ];

      _.forEach(layerInfos, function (layInf, layIndex) {
        $http.get(`/assets/geojson/${layInf.geoJsonFname}`).success(
          function (geojson) {
            addLayer(layInf.name, geojson, layInf.fillColor, map, layersCtrl);
            if (layIndex === layerInfos.length - 1) {
              $rootScope.isGettingData = false;
            }
          }
        );
      });
    }

    function addLayer(name, geojson, fillColor, map, layersCtrl) {
      let layer = L.geoJSON(geojson, {
        style: function (feature) {
          return {color: fillColor};
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup("<i>" + feature.properties.NAME + "</i>");
          //layer.on({
          //  mouseover: function (e) {
          //    e.target.openPopup();
          //  },
          //  mouseout: function (e) {
          //    e.target.closePopup();
          //  }
          //});
        }
      });
      layer.addTo(map);
      layersCtrl.addOverlay(layer, name);
    }

    // GeoJSON layers
    //===========================================


    // WORKAROUND
    // The map is not re-drawn when the sidebar has been hidden (gray area remains)
    $scope.$watch('isSidebarShown', function (newVal) {
      $timeout(function () {
        if (!newVal) {
          mymap.invalidateSize();
        }
      }, 600);
    });


    /////////////////////////////////////////////////////////////////
    // Map Height issue in Safari

    let browserInfo = getBrowserInfo();
    if (/^safari$/i.test(browserInfo.name)) {
      // If this is Safari
      $timeout(resizeMap, 700);

      var onWindowResize = debounce(resizeMap, 1000);
      $(window).resize(onWindowResize);
    }

    function resizeMap() {
      let wndH = window.innerHeight;
      let hdrH = $('.my-navbar').height();
      let footerH = $('.my-footer').height();
      let mapH = wndH - hdrH;
      $('.my-footer').hide();
      //$('.main-container').height(wndH);
      //$('.content-container').height(mapH);
      //$('.page-content-container').height(mapH);
      $('.moscow-map').height(mapH);
      mymap.invalidateSize();
      //let msg = `
      //wndH = ${wndH}
      //navbarH = ${hdrH}
      //footerH = ${footerH}`;
      //alert(msg);
    }

    // Map Height issue in Safari
    /////////////////////////////////////////////////////////////////

  });

'use strict';

angular.module('projectsApp')
  .controller('MapCtrl', function ($scope, $timeout, $http, socket) {
    //*******************************************
    // Start up code

    let mymap = null;
    let powerPoints = null;
    let powerInfo = null;
    let layersCtrl = null;
    const DEFAULT_LOCATION = {
      lat: 54.928835,
      lon: 43.222835
    };
    const DEFAULT_ZOOM = 11;

    drawMap(DEFAULT_LOCATION);
    mymap.locate({setView: true, maxZoom: DEFAULT_ZOOM});

    // Start up code
    //*******************************************


    ////////////////////////////////////////////////
    // Implementation

    // Custom marker icon
    var yoIcon = L.icon({
      iconUrl: 'assets/images/yeoman.png',
      //shadowUrl: 'leaf-shadow.png',

      iconSize:     [32, 32] // size of the icon
      //shadowSize:   [50, 64], // size of the shadow
      //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      //shadowAnchor: [4, 62],  // the same for the shadow
      //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    //======================================
    // Location detection

    function onLocationFound(e) {
      var radius = e.accuracy / 2;

      L.marker(e.latlng, {icon: yoIcon}).addTo(mymap)
        .bindPopup("Вы в пределах " + radius + " метров от этой точки");

      L.circle(e.latlng, radius).addTo(mymap);
    }
    mymap.on('locationfound', onLocationFound);

    function onLocationError(e) {
      mymap.setView(DEFAULT_LOCATION, DEFAULT_ZOOM);
      alert(e.message);
    }
    mymap.on('locationerror', onLocationError);

    // Location detection
    //======================================

    function drawMap(location) {
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
      mymap = L.map($('.my-map')[0], mapOptions);

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

      addAddLayerButton(mymap);
    }


    //===========================================
    // GeoJSON layers

    let allLayersData = [];
    function loadLayers(map, layersCtrl) {
      //log('create layers');
      $http.get('/api/layers').success(
        function (layersData) {
          _.forEach(layersData, function (data) {
            const name = data.name;
            const geojson = JSON.parse(data.geojson);
            addLayer(name, geojson, map, layersCtrl);
          });
          socket.syncUpdates('layer', allLayersData, onLayersDataChanged);
        }
      );
    }

    function onLayersDataChanged(event, item, array) {
      if (event === 'created') {
        let geoJson = JSON.parse(item.geojson);
        addLayer(item.name, geoJson, mymap, layersCtrl);
      }
    }

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('layer');
    });

    function addLayer(name, geojson, map, layersCtrl) {
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
    }

    const DATETIME_FRMT = 'YYYY.MM.DD HH:mm:ss';
    function addAddLayerButton(map) {
      let ctrl = L.control({position: 'bottomright'});

      ctrl.onAdd = function () {
        this._div = L.DomUtil.create('div', 'addlayer'); // create a div with a class "info"
        this._div.innerHTML = '<button id="add-layer-btn" class="btn btn-default">Добавить слой</button>';
        return this._div;
      };

      ctrl.addTo(mymap);

      // Add button click handler
      $( "#add-layer-btn").click(function() {
        let geojson = genGeoJson();

        let curDt = moment().format(DATETIME_FRMT);
        let layerName = `Слой ${curDt}`;
        let geoJsonStr = JSON.stringify(geojson, null, 2);

        $http.post('/api/layers', {
          name: layerName,
          geojson: geoJsonStr
        });
      });
    }

    function genGeoJson() {
      const BASE_LNG = 43.289483;
      const BASE_LAT = 54.937665;
      const RND_VAL = 0.3;
      let curDt = moment().format(DATETIME_FRMT);
      return [
        {
          "type": "Feature",
          "properties": {
            "name": `Линия ${curDt}`
          },
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [getRandom(BASE_LNG, RND_VAL), getRandom(BASE_LAT, RND_VAL)],
              [getRandom(BASE_LNG, RND_VAL), getRandom(BASE_LAT, RND_VAL)],
              [getRandom(BASE_LNG, RND_VAL), getRandom(BASE_LAT, RND_VAL)]
            ]
          }
        }
      ];
    }

    function getRandom(base, rndVal) {
      return base + _.random(-1 * rndVal, rndVal, true);
    }

    // GeoJSON layers
    //===========================================


    // WORKAROUND
    // The map is not re-drawn when the sidebar has been hidden (gray area remains)
    $scope.$watch('showSidebar', function (newVal) {
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
      $('.my-map').height(mapH);
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

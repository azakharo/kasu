'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope) {

    //*******************************************
    // Start up code

    let mymap = null;
    //const LOCATION = {
    //  lat: 55.745737,
    //  lon: 37.660808
    //};
    //drawMap(LOCATION);
    //drawMarker(LOCATION);

    drawMap(null);
    mymap.locate({setView: true, maxZoom: 11});

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
      alert(e.message);
    }
    mymap.on('locationerror', onLocationError);

    // Location detection
    //======================================

    function drawMap(location) {
      let mapOptions = {
        zoom: 13,
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

      // Overlays
      let mushrooms = createMushrooms();
      let powerPoints = createPowerPoints();

      // Create map
      mapOptions.layers = [streetTiles, mushrooms, powerPoints];
      mymap = L.map($('.my-map')[0], mapOptions);

      // Layer Control
      const baseMaps = {
        "Карта дорог": streetTiles,
        "Базовая карта": grayscaleTiles
      };

      var overlayMaps = {
        "Грибные места": mushrooms,
        "Места силы": powerPoints
      };
      L.control.layers(baseMaps, overlayMaps).addTo(mymap);
    }

    //function drawMarker(location) {
    //  let marker = null;
    //  if (mymap) {
    //    marker = L.marker([location.lat, location.lon], {
    //      title: "я здесь"
    //    }).addTo(mymap);
    //    marker.bindPopup("<b>Привет!</b><br>Я здесь!");
    //  }
    //}

    //===========================================
    // GeoJSON layers

    function createMushrooms() {
      const mushroomPoints = [
        {
          "type": "Feature",
          "properties": {
            "name": "Рядом с Технопарком"
          },
          "geometry": {
            "type": "Point",
            "coordinates": [43.195033, 54.928212]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "name": "Рядом с Колхозным Рынком"
          },
          "geometry": {
            "type": "Point",
            "coordinates": [43.375642, 54.748849]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "name": "Под Бахтызино"
          },
          "geometry": {
            "type": "Point",
            "coordinates": [42.843923, 54.84816]
          }
        }
      ];

      // Mushroom icon
      var iconMushroom = L.icon({
        iconUrl: 'assets/images/mushroom.png',
        iconSize:     [32, 32], // size of the icon
        popupAnchor:  [0, -8] // point from which the popup should open relative to the iconAnchor
      });

      return L.geoJSON(mushroomPoints, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: iconMushroom}).bindPopup("<i>" + feature.properties.name + "</i>")
            .on('mouseover', function (e) {
              e.target.openPopup();
            })
            .on('mouseout', function (e) {
              e.target.closePopup();
            });
        }
      });
    }

    function createPowerPoints() {
      const powerPlaceStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
      };

      const powerPlaces = [
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "properties": {
              "name": "Старый Фонтан",
              "power": "99"
            },
            "coordinates": [[
              [43.340415, 54.924501],
              [43.339686, 54.923117],
              [43.344578, 54.922165],
              [43.344728, 54.922468],
              [43.348044, 54.921837],
              [43.348376, 54.922511],
              [43.3452, 54.923166],
              [43.345329, 54.923500]
            ]]
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "properties": {
              "name": "Лыжная база",
              "power": "80"
            },
            "coordinates": [[
              [43.347799, 54.936358],
              [43.348218, 54.93755],
              [43.345139, 54.938588],
              [43.347413, 54.940676],
              [43.355311, 54.939341],
              [43.358251, 54.937136],
              [43.357693, 54.93663],
              [43.350397, 54.936877],
              [43.349185, 54.936067]
            ]]
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "properties": {
              "name": "Протяжка",
              "power": "90"
            },
            "coordinates": [[
              [43.441994, 54.878620],
              [43.440213, 54.876146],
              [43.441066, 54.874055],
              [43.456607, 54.869379],
              [43.456821, 54.870641],
              [43.452058, 54.872423],
              [43.449826, 54.876382]
            ]]
          }
        }
      ];

      return L.geoJSON(powerPlaces, {style: powerPlaceStyle});
    }

    // GeoJSON layers
    //===========================================

  });

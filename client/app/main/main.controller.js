'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope) {

    let mymap = null;
    //const LOCATION = {
    //  lat: 55.745737,
    //  lon: 37.660808
    //};
    //drawMap(LOCATION);
    //drawMarker(LOCATION);

    drawMap(null);
    mymap.locate({setView: true, maxZoom: 16});


    ////////////////////////////////////////////////
    // Implementation

    var yoIcon = L.icon({
      iconUrl: 'assets/images/yeoman.png',
      //shadowUrl: 'leaf-shadow.png',

      iconSize:     [32, 32] // size of the icon
      //shadowSize:   [50, 64], // size of the shadow
      //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      //shadowAnchor: [4, 62],  // the same for the shadow
      //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

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

    function drawMap(location) {
      let mapOptions = {
        zoom: 13,
        attributionControl: false,
        preferCanvas: true
      };
      if (location) {
        mapOptions.center = [location.lat, location.lon];
      }
      mymap = L.map($('.my-map')[0], mapOptions);

      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        //attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiYXpha2hhcm8iLCJhIjoiY2l1cDhvMnY4MDAxMzJvcGt1ZmVyaGVkYSJ9.N1F11vuDHwrrkuEXjBSOeA'
      }).addTo(mymap);
    }

    function drawMarker(location) {
      let marker = null;
      if (mymap) {
        marker = L.marker([location.lat, location.lon], {
          title: "я здесь"
        }).addTo(mymap);
        marker.bindPopup("<b>Привет!</b><br>Я здесь!");
      }
    }

  });

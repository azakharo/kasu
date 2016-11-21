/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Layer = require('../api/layer/layer.model');

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});

Layer.find({}).remove(function() {
  Layer.create({
    name : 'Тревожные события',
    geojson: '\
    [\
      {\
        "type": "Feature",\
        "properties": {\
        "name": "Сирена"\
      },\
        "geometry": {\
        "type": "Point",\
          "coordinates": [43.195033, 54.928212]\
      }\
      },\
      {\
        "type": "Feature",\
        "properties": {\
        "name": "Выстрел"\
      },\
        "geometry": {\
        "type": "Point",\
          "coordinates": [43.375642, 54.748849]\
      }\
      },\
      {\
        "type": "Feature",\
        "properties": {\
        "name": "Разбитое стекло"\
      },\
        "geometry": {\
        "type": "Point",\
          "coordinates": [42.843923, 54.84816]\
      }\
      }\
    ]'
  }, {
    name : 'Криминальные зоны',
    geojson : '\
    [\
      {\
        "type": "Feature",\
        "properties": {\
        "name": "Старый Фонтан",\
          "power": "99"\
      },\
        "geometry": {\
        "type": "Polygon",\
          "coordinates": [[\
          [43.340415, 54.924501],\
          [43.339686, 54.923117],\
          [43.344578, 54.922165],\
          [43.344728, 54.922468],\
          [43.348044, 54.921837],\
          [43.348376, 54.922511],\
          [43.3452, 54.923166],\
          [43.345329, 54.923500]\
        ]]\
      }\
      },\
      {\
        "type": "Feature",\
        "properties": {\
        "name": "Лыжная база",\
          "power": "55"\
      },\
        "geometry": {\
        "type": "Polygon",\
          "coordinates": [[\
          [43.347799, 54.936358],\
          [43.348218, 54.93755],\
          [43.345139, 54.938588],\
          [43.347413, 54.940676],\
          [43.355311, 54.939341],\
          [43.358251, 54.937136],\
          [43.357693, 54.93663],\
          [43.350397, 54.936877],\
          [43.349185, 54.936067]\
        ]]\
      }\
      },\
      {\
        "type": "Feature",\
        "properties": {\
        "name": "Протяжка",\
          "power": "45"\
      },\
        "geometry": {\
        "type": "Polygon",\
          "coordinates": [[\
          [43.441994, 54.878620],\
          [43.440213, 54.876146],\
          [43.441066, 54.874055],\
          [43.456607, 54.869379],\
          [43.456821, 54.870641],\
          [43.452058, 54.872423],\
          [43.449826, 54.876382]\
        ]]\
      }\
      }\
      ]'
  });
});

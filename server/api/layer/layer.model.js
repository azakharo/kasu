'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LayerSchema = new Schema({
  id: String,
  name: String,
  geojson: String
});

module.exports = mongoose.model('Layer', LayerSchema);

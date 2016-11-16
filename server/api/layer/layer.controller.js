'use strict';

var _ = require('lodash');
var Layer = require('./layer.model');

// Get list of layers
exports.index = function(req, res) {
  Layer.find(function (err, layers) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(layers);
  });
};

// Get a single layer
exports.show = function(req, res) {
  Layer.findById(req.params.id, function (err, layer) {
    if(err) { return handleError(res, err); }
    if(!layer) { return res.status(404).send('Not Found'); }
    return res.json(layer);
  });
};

// Creates a new layer in the DB.
exports.create = function(req, res) {
  Layer.create(req.body, function(err, layer) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(layer);
  });
};

//// Updates an existing layer in the DB.
//exports.update = function(req, res) {
//  if(req.body._id) { delete req.body._id; }
//  Layer.findById(req.params.id, function (err, layer) {
//    if (err) { return handleError(res, err); }
//    if(!layer) { return res.status(404).send('Not Found'); }
//    var updated = _.merge(layer, req.body);
//    updated.save(function (err) {
//      if (err) { return handleError(res, err); }
//      return res.status(200).json(layer);
//    });
//  });
//};

// Deletes a layer from the DB.
exports.destroy = function(req, res) {
  Layer.findById(req.params.id, function (err, layer) {
    if(err) { return handleError(res, err); }
    if(!layer) { return res.status(404).send('Not Found'); }
    layer.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

//function handleError(res, err) {
//  return res.status(500).send(err);
//}

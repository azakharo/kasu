/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Layer = require('./layer.model');

exports.register = function(socket) {
  Layer.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Layer.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('layer:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('layer:remove', doc);
}

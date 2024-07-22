const mongoose = require('mongoose');

const konveyorSchema = new mongoose.Schema({
  ind1: {
    type: Number,
    required: false,
  },
  ind2: {
    type: Number,
    required: false,
  },
  kec1: {
    type: Number,
    required: false,
  },
  kec2: {
    type: Number,
    required: false,
  },
  kond: {
    type: Number,
    required: false,
  },
  dur: {
    type: Number,
    required: false,
  },
  konv1: {
    type: Number,
    required: false,
  },
  konv2: {
    type: Number,
    required: false,
  },
  stat: {
    type: Number,
    required: false,
  },
  table: {
    type: Number,
    required: false,
  },
  startA: {
    type: Number,
    required: false,
  },
  startB: {
    type: Number,
    required: false,
  },
  waktu: {
    type: Date,
    default: Date.now,
  },
});

const DataKonveyor = mongoose.model('DataKonveyor', konveyorSchema);

module.exports = DataKonveyor;

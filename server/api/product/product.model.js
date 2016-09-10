'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TestsSchema = new Schema({
  tecid:{
    type: String
  },
  uid: String,
  category: {_id: String, name: String,},
  features: Array,
  user:{
    type: Schema.ObjectId,
    ref: 'User'
  },
  active: { type: Boolean, default: true },
  updated: {type: Date, default: Date.now}
}, { versionKey: false });

module.exports = mongoose.model('Product', TestsSchema);

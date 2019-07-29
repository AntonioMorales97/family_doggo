const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { WALK_EXPIRATION } = require('../config/config');

const WalkSchema = new Schema({
  _familyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Family'
  },
  dogs: {
    type: String,
    required: true
  },
  person: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  pee: {
    type: Boolean,
    required: true
  },
  poop: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: WALK_EXPIRATION
  }
});
module.exports = Walk = mongoose.model('walk', WalkSchema);

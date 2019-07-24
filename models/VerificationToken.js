const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { VERIFICATION_EXPIRATION } = require('../config/config');

const VerificationTokenSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: VERIFICATION_EXPIRATION
  }
});

module.exports = VerificationToken = mongoose.model(
  'verification_token',
  VerificationTokenSchema
);

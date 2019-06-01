const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');
const verificationExpiration = config.get('VERIFICATION_EXPIRATION');

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
    index: {
      expireAfterSeconds: verificationExpiration
    }
  }
});

module.exports = VerificationToken = mongoose.model(
  'verification_token',
  VerificationTokenSchema
);

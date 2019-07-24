const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { VERIFICATION_EXPIRATION } = require('../config/config');

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  _familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family'
  },
  createdAt: {
    type: Date,
    expires: VERIFICATION_EXPIRATION
  },
  registrationDate: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = User = mongoose.model('user', UserSchema);

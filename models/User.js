const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');
const verificationExpiration = config.get('VERIFICATION_EXPIRATION');

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
    expires: verificationExpiration
  },
  registrationDate: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = User = mongoose.model('user', UserSchema);

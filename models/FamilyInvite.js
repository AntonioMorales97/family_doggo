const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');
const invitationExpiration = config.get('INVITATION_EXPIRATION');

const FamilyInviteSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  _familyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Family'
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
    expires: invitationExpiration
  }
});

module.exports = FamilyInvite = mongoose.model(
  'family_invite',
  FamilyInviteSchema
);

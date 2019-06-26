const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FamilySchema = new Schema({
  numberOfMembers: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

module.exports = Family = mongoose.model('family', FamilySchema);

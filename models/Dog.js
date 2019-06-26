const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DogSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  _familyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Family'
  },
  registrationDate: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = Dog = mongoose.model('dog', DogSchema);

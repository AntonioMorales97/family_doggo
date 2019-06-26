const express = require('express');
const router = express.Router();
const {
  userRateLimiter,
  userSlowDown
} = require('../../../middleware/limitation');
const auth = require('../../../middleware/authentication');

// Models
const User = require('../../../models/User');
const Dog = require('../../../models/Dog');

// @route   GET api/dashboard/dogs
// @desc    Get all family dogs
// @access  Private
router.get('/', auth, (req, res) => {
  const { user } = req;
  User.findOne({ _id: user.id }).then(user => {
    if (!user._familyId)
      return res.status(400).json({ msg: 'User has no registered family' });

    Dog.find({ _familyId: user._familyId }).then(dogs => {
      return res.status(200).json({ dogs });
    });
  });
});

// @route   POST api/dashboard/dogs
// @desc    Add dog to the family
// @access  Private
router.post('/', auth, (req, res) => {
  const { user } = req;
  User.findOne({ _id: user.id }).then(user => {
    if (!user._familyId)
      return res.status(400).json({
        msg: 'You must have a registered family to be able to add dogs'
      });
    const dog = new Dog({
      name: req.body.name,
      _familyId: user._familyId
    });

    dog
      .save()
      .then(savedDog =>
        res
          .status(200)
          .json({ msg: `${savedDog.name} was added to the family!` })
      );
  });
});

// @route   DELETE api/dashboard/dogs
// @desc    Delete dog from the family
// @access  Private
router.delete('/', auth, (req, res) => {
  const { user } = req;
  const { dog } = req.body;
  User.findOne({ _id: user.id }).then(user => {
    if (!user._familyId)
      return res.status(400).json({
        msg: 'You must have a registered family to be able to delete dogs'
      });
    Dog.findOne({ _id: dog }).then(dog => {
      if (!dog)
        return res
          .status(400)
          .json({ msg: 'No dog was found with the given ID' });
      if (!dog._familyId.equals(user._familyId)) {
        return res
          .status(400)
          .json({ msg: 'You cannot delete dogs from other families' });
      }
      dog.remove().then(() => {
        return res
          .status(200)
          .json({ msg: `Successfully removed ${dog.name} from the family` });
      });
    });
  });
});

module.exports = router;

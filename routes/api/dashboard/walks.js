const express = require('express');
const router = express.Router();
const {
  userRateLimiter,
  userSlowDown
} = require('../../../middleware/limitation');
const auth = require('../../../middleware/authentication');

// Models
const User = require('../../../models/User');
const Walk = require('../../../models/Walk');

// @route   POST api/dashboard/walks
// @desc    Add walk to the family
// @access  Private
router.post('/', auth, (req, res) => {
  const { dogs, date, time, duration, pee, poop } = req.body;
  if (
    !dogs ||
    !date ||
    !time ||
    !duration ||
    pee === undefined ||
    poop === undefined
  )
    return res
      .status(400)
      .json({ msg: 'You must enter all mandatory fields!' });

  const { user } = req;
  User.findOne({ _id: user.id }).then(user => {
    if (!user._familyId)
      return res.status(400).json({
        msg: 'You must have a registered family to be able to add walks'
      });
    const walk = new Walk({
      _familyId: user._familyId,
      dogs,
      person: user.name,
      date,
      time,
      duration,
      pee,
      poop
    });

    walk.save().then(savedWalk =>
      res.status(200).json({
        newWalk: savedWalk
      })
    );
  });
});

// @route   DELETE api/dashboard/walks
// @desc    Delete walk from the family
// @access  Private
router.delete('/', auth, (req, res) => {
  const { user } = req;
  const { id } = req.body;
  if (!id)
    return res.status(400).json({ msg: 'Walk must have an ID for delete' });

  User.findOne({ _id: user.id }).then(user => {
    if (!user._familyId)
      return res.status(400).json({
        msg: 'You must have a registered family to be able to delete walks'
      });
    Walk.findOne({ _id: id }).then(walk => {
      if (!walk)
        return res.status(200).json({
          msg:
            'Nothing could be removed since no walk was found with the given ID'
        });
      if (!walk._familyId.equals(user._familyId)) {
        return res
          .status(400)
          .json({ msg: 'You cannot delete walks from other families' });
      }
      walk.remove().then(() => {
        return res
          .status(200)
          .json({ msg: `Successfully removed walk`, walkId: walk._id });
      });
    });
  });
});

module.exports = router;

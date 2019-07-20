const express = require('express');
const router = express.Router();
const config = require('config');
const crypto = require('crypto');
const {
  userRateLimiter,
  userSlowDown
} = require('../../../middleware/limitation');
const auth = require('../../../middleware/authentication');

// Email
const sendEmail = require('../../../email/send');
const templates = require('../../../email/templates');

// Models
const User = require('../../../models/User');
const FamilyInvite = require('../../../models/FamilyInvite');
const Family = require('../../../models/Family');
const Dog = require('../../../models/Dog');

// Constants
const invitationExpiration = config.get('INVITATION_EXPIRATION');

// @route   POST api/dashboard/family
// @desc    Register new family
// @access  Private
router.post('/', auth, (req, res) => {
  const { name } = req.body;
  const { user } = req;

  if (!name) return res.status(400).json({ msg: 'Please enter family name!' });

  User.findOne({ _id: user.id }).then(user => {
    if (!user)
      return res
        .status(400)
        .json({ msg: 'We could not find you in our system' });
    if (user._familyId)
      return res
        .status(400)
        .json({ msg: 'You can only belong to one family at the moment' });

    const newFamily = new Family({
      name,
      numberOfMembers: 1
    });

    newFamily.save().then(family => {
      user._familyId = family.id;
      user.save().then(user => {
        return res
          .status(200)
          .json({ msg: `The family ${family.name} was successfully created!` });
      });
    });
  });
});

// @route   GET api/dashboard/family/leave
// @desc    Leave the family
// @access  Private
router.get('/leave', auth, (req, res) => {
  const { user } = req;
  User.findOne({ _id: user.id }).then(user => {
    if (!user)
      return res
        .status(400)
        .json({ msg: 'We could not find you in our system' });
    if (!user._familyId)
      return res
        .status(400)
        .json({ msg: 'You do not have a family registered' });
    const familyId = user._familyId;
    user._familyId = undefined;
    user.save().then(user => {
      res.status(200).json({ msg: 'Successfully left family' });

      Family.findOne({ _id: familyId }).then(family => {
        if (!family) return;

        let { numberOfMembers } = family;
        numberOfMembers--;
        if (numberOfMembers > 0) {
          family.numberOfMembers = numberOfMembers;
          family.save();
        } else {
          family.remove().then(() => {
            //Delete dogs too
            Dog.deleteMany({ _familyId: family._id }).catch(err =>
              console.log(err.message)
            );
          });
        }
      });
    });
  });
});

// @route   POST api/dashboard/family/invite
// @desc    Invite others to your family
// @access  Private
router.post('/invite', auth, (req, res) => {
  const { user } = req;
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ msg: 'Enter email to send invitation' });

  User.findOne({ _id: user.id }).then(user => {
    if (!user)
      return res
        .status(400)
        .json({ msg: 'We could not find you in our system' });
    if (!user._familyId)
      return res
        .status(400)
        .json({ msg: 'You must have a family registered to invite others' });
    if (user.email === email)
      return res.status(400).json({ msg: 'You cannot invite yourself' });

    User.findOne({ email }).then(userToInvite => {
      if (!userToInvite)
        return res
          .status(400)
          .json({ msg: 'The user you are trying to invite does not exist' });
      if (!userToInvite.isVerified)
        return res.status(400).json({
          msg:
            'User is not verified and cannot be invited to a family at the moment'
        });
      if (userToInvite._familyId)
        return res.status(400).json({
          msg:
            'The user you are trying to invite already has a family registered'
        });

      invitation = new FamilyInvite({
        _userId: userToInvite.id,
        _familyId: user._familyId,
        token: crypto.randomBytes(10).toString('hex')
      });

      invitation.save().then(token => {
        // Send invitation email
        sendEmail(
          email,
          templates.invitationToFamily(
            token.token,
            user.name,
            invitationExpiration / (60 * 60)
          )
        )
          .then(() =>
            res.status(200).json({
              msg: `An invitation mail has been sent to ${email}`
            })
          )
          .catch(err => res.status(500).json({ msg: err.message }));
      });
    });
  });
});

// @route   GET api/dashboard/family/join-family/:token
// @desc    Accept family invitation and join family
// @access  Public
router.get('/join-family/:token', (req, res) => {
  FamilyInvite.findOne({ token: req.params.token }).then(invitation => {
    if (!invitation)
      return res
        .status(400)
        .json({ msg: 'Invite was not found, invite may have expired' });
    Family.findOne({ _id: invitation._familyId }).then(family => {
      if (!family)
        return res.status(400).json({
          msg: 'Family ID was not found. Family may have been removed'
        });
      User.findOne({ _id: invitation._userId }).then(user => {
        if (!user) return res.status(400).json({ msg: 'User was not found' });
        if (user._familyId)
          return res
            .status(400)
            .json({ msg: 'User has an already registered family' });

        user._familyId = family.id;
        user.save().then(user => {
          // Send confirmation mail
          sendEmail(
            user.email,
            templates.familyJoinConfirmation(user.name, family.name)
          )
            .then(() => {
              res.status(200).json({
                msg: `Successfully joined family. A confirmation email has been sent to ${
                  user.email
                }. Login to start adding walks with your family!`
              });
              let { numberOfMembers } = family;
              numberOfMembers++;
              family.numberOfMembers = numberOfMembers;
              family.save();
            })
            .catch(err => res.status(500).json({ msg: err.message }));
        });
      });
    });
  });
});

module.exports = router;

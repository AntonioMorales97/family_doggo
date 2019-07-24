const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {
  userRateLimiter,
  userSlowDown
} = require('../../middleware/limitation');

// Email
const sendEmail = require('../../email/send');
const templates = require('../../email/templates');

// Models
const User = require('../../models/User');
const VerificationToken = require('../../models/VerificationToken');

// Constants
const {
  VERIFICATION_EXPIRATION,
  RESET_PASSWORD_EXPIRATION
} = require('../../config/config');

// @route   POST api/users
// @desc    Register new user and wait for verification
// @access  Public
router.post('/', [userRateLimiter, userSlowDown], (req, res) => {
  const { name, email, password } = req.body;

  // Simple validation
  if (!name || !email || !password)
    return res.status(400).json({ msg: 'Please enter all fields' });

  if (password.length < 6)
    return res
      .status(400)
      .json({ msg: 'Password must be longer than 6 characters!' });

  // Check for existing user
  User.findOne({ email }).then(user => {
    if (user) {
      if (user.isVerified) {
        return res
          .status(400)
          .json({ msg: 'That email is already registered' });
      } else if (
        Math.abs(user.createdAt - Date.now()) / 1000 <
        VERIFICATION_EXPIRATION
      ) {
        return res.status(400).json({
          msg:
            'That email has been registered but not verified. Please check your email and verify or try again later'
        });
      } else {
        // Delete expired user if mongodb has not already removed it...
        User.findByIdAndRemove(user._id, err => {
          if (err) return res.status(500).json({ msg: err.message });
        });
      }
    }

    const newUser = new User({
      name,
      email,
      password,
      createdAt: Date.now()
    });

    // Create salt and hash
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(500).json({ msg: err.message });
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) return res.status(500).json({ msg: err.message });
        newUser.password = hash; //set hash
        // Save user
        newUser.save().then(user => {
          // Create verification token
          var token = new VerificationToken({
            _userId: user._id,
            token: crypto.randomBytes(10).toString('hex')
          });

          // Save verification token
          token.save().then(token => {
            // Send the email
            sendEmail(
              email,
              templates.confirm(
                token.token,
                VERIFICATION_EXPIRATION / (60 * 60)
              )
            )
              .then(() =>
                res.status(200).json({
                  msg: `A verification email has been sent to ${email} and will expire in ${VERIFICATION_EXPIRATION /
                    (60 * 60)} hours. Please verify and then login`
                })
              )
              .catch(err => res.status(500).json({ msg: err.message }));
          });
        });
      });
    });
  });
});

// @route   GET api/users/confirmation/:token
// @desc    Verification of email
// @access  Public
router.get(
  '/confirmation/:token',
  [userRateLimiter, userSlowDown],
  (req, res) => {
    VerificationToken.findOne({ token: req.params.token }).then(token => {
      if (!token)
        return res
          .status(400)
          .json({ msg: 'Token does not exists. Token may have expired.' });

      // Token exists, find user
      User.findOne({ _id: token._userId }).then(user => {
        if (!user)
          return res.status(400).json({ msg: 'No user matches this token.' });
        if (user.isVerified)
          return res
            .status(400)
            .json({ msg: 'This user has already been verified.' });

        // Verify user and save. Also remove expiration
        user.isVerified = true;
        user.createdAt = undefined;
        user.save().then(user => {
          res.status(200).json({
            msg: `Welcome ${
              user.name
            }, your account has been verified. Please log in.`
          });
        });
      });
    });
  }
);

// @route   GET api/users/forgot
// @desc    For users that have forgotten their password.
//          This will create a resetPassword-token and send an email
//          to the user if the email exists
// @access  Public
router.post('/forgot', [userRateLimiter, userSlowDown], (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ msg: 'Please enter an email' });
  }

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    } else if (user.passwordResetExpires > Date.now()) {
      return res
        .status(400)
        .json({ msg: 'An email has already been sent to that email address!' });
    }

    user.passwordResetToken = crypto.randomBytes(10).toString('hex');
    user.passwordResetExpires = Date.now() + RESET_PASSWORD_EXPIRATION;

    user.save().then(user => {
      sendEmail(email, templates.resetPassword(user.passwordResetToken))
        .then(() =>
          res.status(200).json({
            msg: `An email has been sent to ${email} with instructions how to reset your password`
          })
        )
        .catch(err => res.status(500).json({ msg: err.message }));
    });
  });
});

// @route   GET api/users/reset/:token
// @desc    Reset of password
// @access  Public
router.post('/reset/:token', [userRateLimiter, userSlowDown], (req, res) => {
  User.findOne({
    passwordResetToken: req.params.token,
    passwordResetExpires: { $gt: Date.now() }
  }).then(user => {
    if (!user)
      return res.status(400).json({
        msg: 'The password reset token is invalid or has already expired'
      });

    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword)
      return res.status(400).json({ msg: 'Please enter all fields!' });

    if (password.length < 6)
      return res
        .status(400)
        .json({ msg: 'Password must be longer than 6 characters!' });

    if (password !== confirmPassword)
      return res.status(400).json({ msg: 'Passwords do not match!' });

    // Create salt and hash
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(500).json({ msg: err.message });
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return res.status(500).json({ msg: err.message });
        user.password = hash; //set hash
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        // Save user
        user.save().then(user => {
          sendEmail(user.email, templates.resetPasswordConfirmation(user.email))
            .then(() =>
              res.status(200).json({
                msg: `Password changed successfully. An email confirmation has been sent to ${
                  user.email
                }`
              })
            )
            .catch(err => res.status(500).json({ msg: err.message }));
        });
      });
    });
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const {
  userRateLimiter,
  userSlowDown
} = require('../../middleware/limitation');

// Gmail Credentials
const GMAIL_USERNAME = config.get('GMAIL_USERNAME');
const GMAIL_PASSWORD = config.get('GMAIL_PASSWORD');

// Models
const User = require('../../models/User');
const VerificationToken = require('../../models/VerificationToken');

// Constants
const verificationExpiration = config.get('VERIFICATION_EXPIRATION');

// @route   POST api/users
// @desc    Register new user and wait for verification
// @access  Public
router.post('/', [userRateLimiter, userSlowDown], (req, res) => {
  const { name, email, password } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  User.findOne({ email }).then(user => {
    if (user) {
      if (user.isVerified) {
        return res
          .status(400)
          .json({ msg: 'That email is already registered' });
      } else if (
        Math.abs(user.createdAt - Date.now()) / 1000 <
        verificationExpiration
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
      password
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
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: { user: GMAIL_USERNAME, pass: GMAIL_PASSWORD }
            });
            var mailOptions = {
              from: GMAIL_USERNAME,
              to: email,
              subject: 'Account Verification',
              text:
                'Hello,\n\nPlease verify your account by clicking the link: ' +
                '\nhttp://' +
                req.headers.host +
                '/api/users/confirmation/' +
                token.token +
                '.\n'
            };

            transporter.sendMail(mailOptions, err => {
              if (err) return res.status(500).json({ msg: err.message });
              res.status(200).json({
                msg: `A verification email has been sent to ${email} and will expire in ${verificationExpiration /
                  (60 * 60)} hours. Please verify and then login.`
              });
            });
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

module.exports = router;

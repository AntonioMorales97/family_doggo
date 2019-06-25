const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/authentication');
const {
  loginRateLimiter,
  loginSlowDown,
  getUserSlowDown
} = require('../../middleware/limitation');

// User Model
const User = require('../../models/User');

// @route   POST api/auth
// @desc    Try to authenticate user
// @access  Public
router.post('/', [loginRateLimiter, loginSlowDown], (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  User.findOne({ email }).then(user => {
    if (!user) return res.status(400).json({ msg: 'User does not exist' });
    if (!user.isVerified)
      return res
        .status(400)
        .json({ msg: 'User is not verified. Please verify or register user' });

    // Validate password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      jwt.sign(
        { id: user.id },
        config.get('JWT_SECRET'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;

          const cookieConfig = {
            httpOnly: true,
            maxAge: 3600 * 1000,
            signed: true
          };

          res.cookie(config.get('COOKIE_USER_TOKEN'), token, cookieConfig);
          res.status(200).json({
            user: {
              id: user.id,
              name: user.name,
              email: user.email
            }
          });
        }
      );
    });
  });
});

// @route   POST api/auth/logout
// @desc    Logout user by removing signed cookie 'token'
// @access  Public
router.post('/logout', (req, res) => {
  res.cookie(config.get('COOKIE_USER_TOKEN'), { expires: Date.now() });
  res.status(200).send();
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', [getUserSlowDown, auth], (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user));
});

module.exports = router;

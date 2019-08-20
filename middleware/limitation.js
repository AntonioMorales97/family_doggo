const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// Limiters for api/users
const userRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    msg: 'Too many requests, please try again later'
  }
});

const userSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 1,
  delayMs: 300
});

// Limiters for api/auth
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    msg: 'Too many attempts, please try again later'
  }
});

const loginSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 1,
  delayMs: 300
});

const getUserSlowDown = slowDown({
  windowMs: 5 * 60 * 1000,
  delayAfter: 10,
  delayMs: 100,
  maxDelayMs: 1000
});

module.exports = {
  userRateLimiter,
  userSlowDown,
  loginRateLimiter,
  loginSlowDown,
  getUserSlowDown
};

const { JWT_SECRET } = require('../config/config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.signedCookies.token;
  if (!token)
    return res
      .status(401)
      .json({ msg: 'Authentication token not found, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Authentication token is not valid' });
  }
}

module.exports = auth;

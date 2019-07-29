module.exports = {
  CLIENT_ORIGIN:
    process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_ORIGIN
      : 'http://localhost:3000',
  MONGO_URI: process.env.MONGO_URI,
  COOKIE_USER_TOKEN: 'token',
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  GMAIL_USERNAME: 'noreplyfamilydog@gmail.com',
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
  INVITATION_EXPIRATION: 21600,
  VERIFICATION_EXPIRATION: 21600,
  RESET_PASSWORD_EXPIRATION: 21600,
  WALK_EXPIRATION: 86400
};

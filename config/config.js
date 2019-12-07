module.exports = {
  CLIENT_ORIGIN:
    process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_ORIGIN
      : 'http://localhost:3000',
  MONGO_URI: process.env.MONGO_URI,
  COOKIE_USER_TOKEN: 'token',
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  MAIL_USERNAME: 'noreplyfamilydoggo@gmail.com',
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  INVITATION_EXPIRATION: 21600, // 21600 seconds
  VERIFICATION_EXPIRATION: 21600, // 21600 seconds
  RESET_PASSWORD_EXPIRATION: 1000 * 60 * 60, // 1 hour
  WALK_EXPIRATION: 86400 // 86400 seconds
};

const nodemailer = require('nodemailer');
const { MAIL_USERNAME, MAIL_PASSWORD } = require('../config/config');

const credentials = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD
  }
};

const transporter = nodemailer.createTransport(credentials);

module.exports = async (to, content) => {
  const contacts = {
    from: `"Family Doggo" <${credentials.auth.user}>`,
    to
  };

  const email = Object.assign({}, content, contacts);

  await transporter.sendMail(email);
};

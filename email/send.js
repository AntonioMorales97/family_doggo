const nodemailer = require('nodemailer');
const { GMAIL_USERNAME, GMAIL_PASSWORD } = require('../config/config');

const credentials = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_USERNAME,
    pass: GMAIL_PASSWORD
  }
};

const transporter = nodemailer.createTransport(credentials);

module.exports = async (to, content) => {
  const contacts = {
    from: `"Family Dogo" <${credentials.auth.user}>`,
    to
  };

  const email = Object.assign({}, content, contacts);

  await transporter.sendMail(email);
};

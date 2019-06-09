const nodemailer = require('nodemailer');

const credentials = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'noreplyfamilydog@gmail.com',
    pass: 'familydog123!'
  }
};

const transporter = nodemailer.createTransport(credentials);

module.exports = async (to, content) => {
  const contacts = {
    from: '"Family Dogo" <noreplyfamilydog@gmail.com>',
    to
  };

  const email = Object.assign({}, content, contacts);

  await transporter.sendMail(email);
};

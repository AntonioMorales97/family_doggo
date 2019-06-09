const { CLIENT_ORIGIN } = require('../config/config');

module.exports = {
  confirm: token => ({
    subject: 'React Confirm Email',
    html: `
    <h1>Hello,</h1>
          <a href='${CLIENT_ORIGIN}/confirm/${token}'>
            Click to verify email and account
          </a>
        `,
    text: `Copy and paste this link: ${CLIENT_ORIGIN}/confirm/${token}`
  })
};

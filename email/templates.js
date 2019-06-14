const { CLIENT_ORIGIN } = require('../config/config');

module.exports = {
  confirm: token => ({
    subject: 'Confirm Email',
    html: `
    <h1>Hello,</h1>
          <a href='${CLIENT_ORIGIN}/confirm/${token}'>
            Click to verify email and account
          </a>
        `,
    text: `Copy and paste this link: ${CLIENT_ORIGIN}/confirm/${token}`
  }),
  resetPassword: token => ({
    subject: 'Reset Password',
    html: `
    <h1>Hello,</h1>
          <p>This mail has been sent to you because you (or someone else) have 
          requested to reset your password. <strong>If this was not you, please ignore this email.</strong></p>
          <a href='${CLIENT_ORIGIN}/reset/${token}'>
            Click to reset your password
          </a>
        `,
    text: `Copy and paste this link: ${CLIENT_ORIGIN}/reset/${token}`
  }),
  resetPasswordConfirmation: email => ({
    subject: 'Reset Password Confirmation',
    html: `
    <h1>Hello,</h1>
          <p>This mail has been sent to you as a confirmation that the password for 
          the account ${email} has been successfully changed.</p>
          <a href='${CLIENT_ORIGIN}/login'>
            Click to login with your new password
          </a>
        `,
    text: `Copy and paste this link: ${CLIENT_ORIGIN}/login`
  })
};

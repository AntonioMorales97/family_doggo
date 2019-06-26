const { CLIENT_ORIGIN } = require('../config/config');

module.exports = {
  confirm: (token, expirationHours) => ({
    subject: 'Account Verification',
    html: `
    <h1>Hello,</h1>
    <p>This mail has been sent to you so you can verify your email address which you provided for us. If 
    this was not you, ignore this email and your email address will remain unverified. The link will expire 
    in ${expirationHours} hours.</p>
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
  }),
  invitationToFamily: (token, invitor, expirationHours) => ({
    subject: 'Family Invitation',
    html: `
    <h1>Hello, </h1>
      <p>This mail has been sent to you because ${invitor} has invited you to join his/her family so you can share walks with your dogs.
      If you don't want to join the family, simply ignore this mail. The link will expire 
      in ${expirationHours} hours. <strong>Please note that you cannot have a family registered if you wish to join a new family.</strong></p>
          <a href='${CLIENT_ORIGIN}/join-family/${token}'>
            Click to join the family!
          </a>
          `,
    text: `Copy and paste this link: ${CLIENT_ORIGIN}/join-family/${token}`
  }),
  familyJoinConfirmation: (name, familyName) => ({
    subject: 'Successfully Joined Family',
    html: `
    <h1>Hello ${name},</h1>
          <p>This mail has been sent to you as a confirmation that you have successfully joined the ${familyName} family!</p>
          <a href='${CLIENT_ORIGIN}/login'>
            Click to login and start adding walks!
          </a>
        `,
    text: `Copy and paste this link: ${CLIENT_ORIGIN}/login`
  })
};

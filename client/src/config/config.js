let server = process.env.REACT_APP_SERVER_API;

const env = process.env.NODE_ENV;

if (env === 'development') server = 'http://localhost:5000';

module.exports = server;

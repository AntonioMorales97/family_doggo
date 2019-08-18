const express = require('express');
const http = require('http');
//const https = require('https');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Check if require and configure dotenv resulted in error, only if not in production
// Since .env is not sent to version control. Must be early in the start of the app.
if (!(process.env.NODE_ENV === 'production')) {
  const dotenvResult = require('dotenv').config();
  if (dotenvResult.error) {
    throw dotenvResult.error;
  }
}
const { CLIENT_ORIGIN, MONGO_URI, COOKIE_SECRET } = require('./config/config');

const app = express();

// Cookie parser
app.use(cookieParser(COOKIE_SECRET));

// Helmet
app.use(helmet());

// Only allow request from the client
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    optionsSuccessStatus: 200
  })
);

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DB Config
const db = MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  }) // Adding new mongoose url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/dashboard/family', require('./routes/api/dashboard/family'));
app.use('/api/dashboard/dogs', require('./routes/api/dashboard/dogs'));
app.use('/api/dashboard/walks', require('./routes/api/dashboard/walks'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

const httpServer = http.createServer(app);
httpServer.listen(port, () =>
  console.log(`HTTP Server started on port ${port}`)
);

let io = require('./sockets/walks').listen(httpServer);

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const cors = require('cors');
const { CLIENT_ORIGIN } = require('./config/config');

const app = express();

// Only allow request from the client
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DB Config
const db = config.get('MONGO_URI');

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

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

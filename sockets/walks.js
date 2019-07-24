const cookieParser = require('socket.io-cookie-parser');
const config = require('config');
const jwt = require('jsonwebtoken');
const socketIO = require('socket.io');

// Clients
let clients = [];

// Models
const Walk = require('../models/Walk');
const User = require('../models/User');

// Simple auth middleware for sockets
function auth(socket, next) {
  const token = socket.request.signedCookies.token;
  if (!token) {
    socket.emit('auth_error', 'No token found');
    console.log('No token found for socket... exit');
    return;
  }

  try {
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));
    socket.user = decoded;
    next();
  } catch (err) {
    socket.emit('auth_error', 'Authentication token is not valid');
    console.log('Authentication token was not valid');
  }
}

module.exports.listen = function(app) {
  io = socketIO.listen(app);
  io.use(cookieParser(config.get('COOKIE_SECRET')));
  io.use(auth); // auth io connection

  io.on('connection', async function(socket) {
    console.log(clients);
    const user = await User.findOne({ _id: socket.user.id }).select(
      '-password'
    );

    let index = clients.findIndex(client => client.id === user._id);
    if (index === -1)
      clients.push({ userId: user._id, familyId: user._familyId });

    socket.join(user._familyId);

    socket.on('disconnect', function() {
      console.log(`${socket.user.name} disconnected!`);
      socket.leave(user._familyId);
      for (var i = 0; i < clients.length; i++) {
        if (clients[i].userId === user._id) {
          clients.splice(i, 1);
          break;
        }
      }
    });

    Walk.find({ _familyId: user._familyId })
      .select('-_familyId')
      .then(walks => {
        socket.emit('initWalks', walks);
      });

    socket.on('addedWalk', function(walk) {
      io.to(user._familyId).emit('addedWalk', walk);
    });

    socket.on('deletedWalk', function(walkId) {
      io.to(user._familyId).emit('deletedWalk', walkId);
    });
  });

  return io;
};

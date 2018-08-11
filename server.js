// starts the dotenv
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

mongoose.Promise = global.Promise;

const app = express();

app.use(morgan('common'));
app.use(express.json());

// static files
app.use(express.static('public'));


const { DATABASE_URL, PORT } = require('./config');
const { router: usersRouter } = require('./users/router');
const { router: authRouter } = require('./auth/router');
const { localStrategy, jwtStrategy } = require('./auth/strategies');
const { router: photoRouter } = require('./photoApp/router');

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/photos', photoRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.get('/api/protected', jwtAuth, (req, res) => res.json({
  data: 'rosebud',
}));

app.use('*', (req, res) => res.status(404).json({ message: 'Not Found' }));

// server variable needed for runServer and closeServer
let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, (err) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on ${port}`);
        resolve();
      })
        .on('error', () => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
    console.log('Closing Server');
    server.close((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  }));
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}


module.exports = { app, runServer, closeServer };

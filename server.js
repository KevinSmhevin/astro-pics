const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;
// starts the dotenv
require('dotenv').config();

const app = express();

app.use(morgan('common'));
app.use(express.json());

// static files
app.use(express.static('public'));

const { DATABASE_URL, PORT } = require('./config');
const photoAppRouter = require('./photoAppRouter');

app.use('/photos', photoAppRouter);

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, (err) => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on ${port}`);
      })
        .on('error', () => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// function closeServer() {
//   return mongoose.disconnect().then()) => {
//     return new Promise((resolve, reject) => {
//       console.log('Closing Server');
//       server.close(err => {
//         if (err) {
//           return reject(err)
//         }
//         resolve();
//       });
//     });
//   });
// }

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer };

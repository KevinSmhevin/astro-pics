const express = require('express');
// starts the dotenv
require('dotenv').config();
require('./config');

const app = express();

// static files
app.use(express.static('public'));

const photoAppRouter = require('./photoAppRouter');

app.use('/photos', photoAppRouter);

app.listen((process.env.PORT || 8080), () => {
  console.log('Your app is listening');
});

module.exports = app;

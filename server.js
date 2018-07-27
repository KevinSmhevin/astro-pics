const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;
// starts the dotenv
require('dotenv').config();
require('./config');

const app = express();

app.use(morgan('common'));
app.use(express.json());

// static files
app.use(express.static('public'));

// const { DATABASE_URL, PORT } = require('./config');
const photoAppRouter = require('./photoAppRouter');

app.use('/photos', photoAppRouter);

// let server;


app.listen((process.env.PORT || 8080), () => {
  console.log('Your app is listening');
});

module.exports = app;

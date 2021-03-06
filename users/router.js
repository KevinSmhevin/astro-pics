const express = require('express');
const passport = require('passport');

const { User } = require('./models');

const router = express.Router();

router.use(express.json());

const config = require('../config');


router.post('/register', (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation Error',
      message: 'Missing field',
      location: missingField,
    });
  }
  const stringFields = ['username', 'password', 'firstName', 'lastName', 'email'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string',
  );
  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation Error',
      message: 'Incorrect field type: expected string',
      location: nonStringField,
    });
  }
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field],
  );
  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation Error',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField,
    });
  }
  const sizedFields = {
    username: {
      min: 5,
    },
    password: {
      min: 10,
      max: 72,
    },
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field => 'min' in sizedFields[field]
              && req.body[field].trim().length < sizedFields[field].min,
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field => 'max' in sizedFields[field]
              && req.body[field].trim().length > sizedFields[field].max,
  );
  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation Error',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField,
    });
  }
  let { username, password, email, firstName = '', lastName = '' } = req.body;
  firstName = firstName.trim();
  lastName = lastName.trim();
  return User.find({ username })
    .count()
    .then((count) => {
      if (count > 0) {
        console.log('Username is taken');
        return Promise.reject({
          code: 422,
          reason: 'Validation Error',
          message: 'Username already taken',
          location: 'username',
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => User.create({
      username,
      password: hash,
      firstName,
      lastName,
      email,
    }))
    .then(user => res.status(201).json(user.serialize()))
    .catch((err) => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'Validation Error') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'internal server error' });
    });
});

router.get('/', (req, res) => User.find()
  .then(users => res.json(users.map(user => user.serialize())))
  .catch(err => res.status(500).json({ message: 'Internal server error' })));
module.exports = { router };

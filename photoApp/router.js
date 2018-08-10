
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();
const cloudinary = require('cloudinary');
const { photoPost } = require('./models');


router.use(bodyParser.json());

const jwtAuth = passport.authenticate('jwt', { session: false });

cloudinary.config({
  cloud_name: 'dljvx3nbw',
  api_key: '878862313859183',
  api_secret: 'Pn3zkm_l9AEyAntbIj6H_zaCV7s',
});

router.get('/', (req, res) => {
  res.status(200).send('Sucessful');
});

router.get('/all', (req, res) => {
  photoPost
    .find()
    .then((photoPosts) => {
      res.json({
        photoPosts: photoPosts.map(photopost => photopost.serialize()),
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  photoPost
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'internal server error' });
    });
});

router.post('/post', jwtAuth, (req, res) => {
  const requiredFields = ['title', 'smallPicture', 'largePicture', 'author', 'description'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing '${field}' in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  const date = `${month}/${day}/${year}`;
  photoPost.create({
    title: req.body.title,
    smallPicture: req.body.smallPicture,
    largePicture: req.body.largePicture,
    author: req.body.author,
    description: req.body.description,
    date,
  })
    .then(post => res.status(201).json(post.serialize()))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.put('/:id', jwtAuth, (req, res) => {
  console.log('hello server side');
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      + `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message });
  }
  photoPost
    .findById(req.params.id)
    .then((post) => {
      if (post.author !== req.user.username) {
        const message = "That post doesn't belong to you";
        console.error(message);
        return res.status(401).json({ message });
      }
      const toUpdate = {};
      const updateableFields = ['title', 'description'];

      for (let i = 0; i < updateableFields.length; i++) {
        const field = updateableFields[i];
        if (req.body[field] === '' || req.body[field] === null) {
          const message = `${field.charAt(0).toUpperCase() + field.substr(1)} is required`;
          console.error(message);
          return res.status(400).json({ message });
        }
      }

      updateableFields.forEach((field) => {
        if (field in req.body) {
          toUpdate[field] = req.body[field];
        }
      });

      photoPost
        .findByIdAndUpdate(req.params.id, { $set: toUpdate }, { new: true })
        .then((_post) => {
          res.status(200).json(_post);
        })
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
    }).catch((err) => {
      console.error(err.message);
    });
});

router.delete('/:id', jwtAuth, (req, res) => {
  photoPost
    .findById(req.params.id)
    .then((post) => {
      if (post.author !== req.user.username) {
        const message = "That post doesn't belong to you";
        console.error(message);
        return res.status(401).json({ message });
      }
    });
  photoPost.findByIdAndRemove(req.params.id)
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error Hello' }));
});
module.exports = { router };

const express = require('express');
const { photoPost } = require('./models');

const router = express.Router();

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

router.post('/post', (req, res) => {
  const requiredFields = ['title', 'smallPicture', 'largePicture', 'author', 'description'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing '${field}' in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  photoPost.create({
    title: req.body.title,
    smallPicture: req.body.smallPicture,
    largePicture: req.body.largePicture,
    author: req.body.author,
    description: req.body.description,
    date: Date.prototype.getDate(),
  });
  return res.status(201).send('post created!');
});
module.exports = router;

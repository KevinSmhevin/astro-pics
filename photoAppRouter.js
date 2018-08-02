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
module.exports = router;

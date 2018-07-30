const express = require('express');
const { photoPost } = require('./models');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('Sucessful');
});

router.get('/photos', (req, res) => {
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
module.exports = router;

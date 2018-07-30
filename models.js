const mongoose = require('mongoose');

const photoPostSchema = mongoose.Schema({
  title: { type: String, required: true },
  picture: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: false },
  likes: { type: Number, required: true },
  date: { type: Date, required: true },
});

const photoPost = mongoose.model('photoPost', photoPostSchema);

module.exports = { photoPost };

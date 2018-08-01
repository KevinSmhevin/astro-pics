const mongoose = require('mongoose');

const photoPostSchema = mongoose.Schema({
  title: { type: String, required: true },
  picture: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: false },
  likes: { type: Number, required: true },
  date: { type: Date, required: true },
});

photoPostSchema.methods.serialize = function () {
  return {
    id: this._id,
    title: this.title,
    picture: this.picture,
    author: this.author,
    description: this.description,
    likes: this.likes,
    date: this.date,
  };
};

const photoPost = mongoose.model('photoPost', photoPostSchema, 'photoPost');

module.exports = { photoPost };

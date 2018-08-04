const mongoose = require('mongoose');

const photoPostSchema = mongoose.Schema({
  title: { type: String, required: true },
  smallPicture: { type: String, required: true },
  largePicture: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: false },
  date: { type: Date, required: true },
});

photoPostSchema.methods.serialize = function () {
  return {
    id: this._id,
    title: this.title,
    smallPicture: this.smallPicture,
    largePicture: this.largePicture,
    author: this.author,
    description: this.description,
    date: this.date,
  };
};

const photoPost = mongoose.model('photoPost', photoPostSchema, 'photoPost');

module.exports = { photoPost };

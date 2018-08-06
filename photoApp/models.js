/* eslint-disable */

const mongoose = require('mongoose');

const photoPostSchema = mongoose.Schema({
  title: { type: String, required: true },
  smallPicture: { data: Buffer, contentType: String, type: String, required: true },
  largePicture: { data: Buffer, contentType: String, type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: false },
  MAX_FILE_SIZE: { type: String, required: true },
  date: { type: String, required: false },
});

photoPostSchema.methods.serialize = function () {
  return {
    id: this._id,
    title: this.title,
    smallPicture: this.smallPicture,
    largePicture: this.largePicture,
    author: this.author,
    description: this.description,
    MAX_FILE_SIZE: this.MAX_FILE_SIZE,
    date: this.date,
  };
};

const photoPost = mongoose.model('photoPost', photoPostSchema, 'photoPost');

module.exports = { photoPost };

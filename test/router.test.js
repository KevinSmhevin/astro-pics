/* eslint prefer-arrow-callback: "off", func-names: "off" */

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const { expect } = chai;
const { app, runServer, closeServer } = require('../server');
const { photoPost } = require('../models.js');
const { TEST_DATABASE_URL } = require('../config.js');

chai.use(chaiHttp);

function tearDownDb() {
  console.warn('Deleting Database');
  return mongoose.connection.dropDatabase();
}

function generatePhotoPostData() {
  return {
    title: faker.name.title(),
    smallPicture: faker.image.nightlife(),
    largePicture: faker.image.nightlife(),
    author: faker.name.firstName(),
    description: faker.lorem.sentence(),
    likes: faker.random.number(),
    date: faker.date.recent(),
  };
}

function seedPhotoPostData() {
  console.info('seeding photo post data');
  const seedData = [];
  for (let i = 0; i < 10; i++) {
    seedData.push(generatePhotoPostData());
  }
  return photoPost.insertMany(seedData);
}

describe('Photo Post API resource', function () {
  before(function () {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function () {
    return seedPhotoPostData();
  });
  afterEach(function () {
    return tearDownDb();
  });
  after(function () {
    return closeServer();
  });
  describe('GET endpoint', () => {
    it('should get photos', () => {
      let res;
      return chai.request(app)
        .get('/photos/all')
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.photoPosts).to.have.lengthOf.at.least(1);
          return photoPost.count();
        })
        .then(function (count) {
          expect(res.body.photoPosts).to.have.lengthOf(count);
          for (let i = 0; i < res.body.photoPosts.length; i++) {
            expect(res.body.photoPosts[i]).to.have.all.keys('id', 'title', 'author', 'date', 'description', 'likes', 'smallPicture', 'largePicture');
          }
        });
    });
  });
});

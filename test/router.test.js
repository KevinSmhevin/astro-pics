/* eslint prefer-arrow-callback: "off", func-names: "off" */


const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { expect } = chai;
const { app, runServer, closeServer } = require('../server');
const { photoPost } = require('../photoApp/models.js');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config.js');

chai.use(chaiHttp);

const email = 'example.user@example.com';
const username = 'exampleUser';
const password = 'examplePass';
const firstName = 'Example';
const lastName = 'User';

function tearDownDb() {
  console.warn('Deleting Database');
  return mongoose.connection.dropDatabase();
}

function generatePhotoPostData() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  const date = `${month}/${day}/${year}`;
  return {
    title: faker.name.title(),
    smallPicture: faker.image.nightlife(),
    largePicture: faker.image.nightlife(),
    author: faker.name.firstName(),
    description: faker.lorem.sentence(),
    date,
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
    it('should get all photos', () => {
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
            expect(res.body.photoPosts[i]).to.have.all.keys('id', 'title', 'author', 'date', 'description', 'smallPicture', 'largePicture');
          }
        });
    });
    it('should get individual photos by ID', () => {
      let res;
      return photoPost
        .findOne()
        .then((post) => {
          const { id } = post;
          return chai.request(app)
            .get(`/photos/${id}`)
            .then((_res) => {
              res = _res;
              expect(res).to.have.status(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.all.keys('id', 'title', 'author', 'date', 'description', 'smallPicture', 'largePicture');
            });
        });
    });
  });
  describe('PUT endpoint', () => {
    it('should update a post', () => {
      const updateData = {
        title: 'Update Title',
        description: 'Updated Description',
      };
      return photoPost
        .findOne()
        .then((post) => {
          const token = jwt.sign(
            {
              user: {
                username: post.author,
              },
            },
            JWT_SECRET,
            {
              algorithm: 'HS256',
              subject: username,
              expiresIn: '7d',
            },
          );
          updateData.id = post.id;
          updateData.author = post.author;
          return chai.request(app)
            .put(`/photos/${post.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData);
        })
        .then((res) => {
          expect(res).to.have.status(200);

          return photoPost.findById(updateData.id);
        })
        .then((post) => {
          expect(post.title).to.equal(updateData.title);
          expect(post.description).to.equal(updateData.description);
        });
    });
    it('should not allow you to update a post that does not belong to you', () => {
      const updateData = {
        title: 'Update Title--',
        description: 'Updated Description--',
        artist: 'a modest guy',
      };
      let hackerName = '';
      return photoPost
        .findOne()
        .then((post) => {
          const token = jwt.sign(
            {
              user: {
                username: 'hackerdude',
              },
            },
            JWT_SECRET,
            {
              algorithm: 'HS256',
              subject: username,
              expiresIn: '7d',
            },
          );
          updateData.id = post.id;
          hackerName = post.username;
          return chai.request(app)
            .put(`/photos/${post.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData)
            .catch((err) => {
              if (err instanceof chai.AssertionError) {
                throw err;
              }
              const res = err.response;
              expect(res).to.have.status(401);
            });
        });
    });
  });
  describe('POST endpoint', () => {
    const token = jwt.sign(
      {
        user: {
          username,
          firstName,
          lastName,
        },
      },
      JWT_SECRET,
      {
        algorithm: 'HS256',
        subject: username,
        expiresIn: '7d',
      },
    );
    it('should create a new post', () => {
      const newPhotoPost = generatePhotoPostData();

      return chai.request(app)
        .post('/photos/post')
        .set('Authorization', `Bearer ${token}`)
        .send(newPhotoPost)
        .then(function (res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'author', 'description', 'smallPicture', 'largePicture', 'date',
          );
          expect(res.body.id).to.not.be.null;
          expect(res.body.title).to.equal(newPhotoPost.title);
          expect(res.body.author).to.equal(newPhotoPost.author);
          expect(res.body.description).to.equal(newPhotoPost.description);
          expect(res.body.smallPicture).to.equal(newPhotoPost.smallPicture);
          expect(res.body.largePicture).to.equal(newPhotoPost.largePicture);
          expect(res.body.date).to.equal(newPhotoPost.date);
          return photoPost.findById(res.body.id);
        })
        .then((post) => {
          expect(post.author).to.equal(newPhotoPost.author);
          expect(post.title).to.equal(newPhotoPost.title);
          expect(post.description).to.equal(newPhotoPost.description);
          expect(post.smallPicture).to.equal(newPhotoPost.smallPicture);
          expect(post.largePicture).to.equal(newPhotoPost.largePicture);
          expect(post.date).to.equal(newPhotoPost.date);
        });
    });
  });
  describe('DELETE endpoint', () => {
    it('should delete a post by ID', () => {
      let post;
      return photoPost
        .findOne()
        .then((_post) => {
          post = _post;
          const token = jwt.sign(
            {
              user: {
                username: post.author,
              },
            },
            JWT_SECRET,
            {
              algorithm: 'HS256',
              subject: username,
              expiresIn: '7d',
            },
          );
          return chai.request(app)
            .delete(`/photos/${post.id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then((res) => {
          expect(res).to.have.status(204);
          return photoPost.findById(photoPost.id);
        })
        .then((_post) => {
          expect(_post).to.be.null;
        });
    });
    it('should not allow you delete a post that does not belong to you', () => {
      let post;
      let hackerName;
      return photoPost
        .findOne()
        .then((_post) => {
          post = _post;
          const token = jwt.sign(
            {
              user: {
                username: 'hackerdude',
              },
            },
            JWT_SECRET,
            {
              algorithm: 'HS256',
              subject: username,
              expiresIn: '7d',
            },
          );
          return chai.request(app)
            .delete(`/photos/${post.id}`)
            .set('Authorization', `Bearer ${token}`)
            .catch((err) => {
              if (err instanceof chai.AssertionError) {
                throw err;
              }
              const res = err.response;
              expect(res).to.have.status(401);
            });
        });
    });
  });
});

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { User } = require('../users/models');

const { expect } = chai;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('/api/user', () => {
  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'Example';
  const lastName = 'User';
  const email = 'exampleEmail@exampleEmail.com';
  const usernameB = 'exampleUserB';
  const passwordB = 'examplePassB';
  const firstNameB = 'ExampleB';
  const lastNameB = 'UserB';
  const emailB = 'exampleEmailB@exampleEmail.com';

  before(() => runServer(TEST_DATABASE_URL));

  after(() => closeServer());

  beforeEach(() => {});
  afterEach(() => User.remove({}));

  describe('/api/users', () => {
    describe('POST', () => {
      it('Should reject users with missing username', () => chai
        .request(app)
        .post('/api/users/register')
        .send({
          password,
          firstName,
          lastName,
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('Validation Error');
          expect(res.body.message).to.equal('Missing field');
          expect(res.body.location).to.equal('username');
        }));
      it('Should reject users with missing password', () => chai
        .request(app)
        .post('/api/users/register')
        .send({
          username,
          firstName,
          lastName,
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('Validation Error');
          expect(res.body.message).to.equal('Missing field');
          expect(res.body.location).to.equal('password');
        }));
      it('Should reject users with non-string username', () => chai
        .request(app)
        .post('/api/users/register')
        .send({
          username: 1234,
          password,
          firstName,
          lastName,
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('Validation Error');
          expect(res.body.message).to.equal(
            'Incorrect field type: expected string',
          );
          expect(res.body.location).to.equal('username');
        }));
      it('Should reject users with non-string password', () => chai
        .request(app)
        .post('/api/users/register')
        .send({
          username,
          password: 1234,
          firstName,
          lastName,
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('Validation Error');
          expect(res.body.message).to.equal(
            'Incorrect field type: expected string',
          );
          expect(res.body.location).to.equal('password');
        }));
      it('Should reject users with non-string first name', () => chai
        .request(app)
        .post('/api/users/register')
        .send({
          username,
          password,
          firstName: 1234,
          lastName,
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('Validation Error');
          expect(res.body.message).to.equal(
            'Incorrect field type: expected string',
          );
          expect(res.body.location).to.equal('firstName');
        }));
      it('Should reject users with non-string last name', () => chai
        .request(app)
        .post('/api/users/register')
        .send({
          username,
          password,
          firstName,
          lastName: 1234,
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('Validation Error');
          expect(res.body.message).to.equal(
            'Incorrect field type: expected string',
          );
          expect(res.body.location).to.equal('lastName');
        }));
      it('Should reject users with non-trimmed username', () => chai
        .request(app)
        .post('/api/users/register')
        .send({
          username: ` ${username} `,
          password,
          firstName,
          lastName,
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('Validation Error');
          expect(res.body.message).to.equal(
            'Cannot start or end with whitespace',
          );
          expect(res.body.location).to.equal('username');
        }));
      it('Should reject users with non-trimmed password', () => chai
        .request(app)
        .post('/api/users/register')
        .send({
          username,
          password: ` ${password} `,
          firstName,
          lastName,
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('Validation Error');
          expect(res.body.message).to.equal(
            'Cannot start or end with whitespace',
          );
          expect(res.body.location).to.equal('password');
        }));
      it('Should reject users with empty username', () => chai
        .request(app)
        .post('/api/users/register')
        .send({
          username: '',
          password,
          firstName,
          lastName,
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('Validation Error');
          expect(res.body.message).to.equal(
            'Must be at least 5 characters long',
          );
          expect(res.body.location).to.equal('username');
        }));
      it('Should reject users with password less than ten characters', () => chai
        .request(app)
        .post('/api/users/register')
        .send({
          username,
          password: '123456789',
          firstName,
          lastName,
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('Validation Error');
          expect(res.body.message).to.equal(
            'Must be at least 10 characters long',
          );
          expect(res.body.location).to.equal('password');
        }));
      it('Should reject users with password greater than 72 characters', () => chai
        .request(app)
        .post('/api/users/register')
        .send({
          username,
          password: new Array(73).fill('a').join(''),
          firstName,
          lastName,
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('Validation Error');
          expect(res.body.message).to.equal(
            'Must be at most 72 characters long',
          );
          expect(res.body.location).to.equal('password');
        }));
      it('Should reject users with duplicate username', () => User.create({
        username,
        password,
        firstName,
        lastName,
      })
        .then(() => chai.request(app).post('/api/users/register').send({
          username,
          password,
          firstName,
          lastName,
        }))
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('Validation Error');
          expect(res.body.message).to.equal(
            'Username already taken',
          );
          expect(res.body.location).to.equal('username');
        }));
      it('Should create a new user', () => chai
        .request(app)
        .post('/api/users/register')
        .send({
          username,
          password,
          firstName,
          lastName,
        })
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys(
            'username',
            'firstName',
            'lastName',
            'email',
          );
          expect(res.body.username).to.equal(username);
          expect(res.body.firstName).to.equal(firstName);
          expect(res.body.lastName).to.equal(lastName);
          return User.findOne({
            username,
          });
        })
        .then((user) => {
          expect(user).to.not.be.null;
          expect(user.firstName).to.equal(firstName);
          expect(user.lastName).to.equal(lastName);
          return user.validatePassword(password);
        })
        .then((passwordIsCorrect) => {
          expect(passwordIsCorrect).to.be.true;
        }));
      it('Should trim firstName and lastName', () => chai
        .request(app)
        .post('/api/users/register')
        .send({
          username,
          password,
          firstName: ` ${firstName} `,
          lastName: ` ${lastName} `,
          email,
        })
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys(
            'username',
            'firstName',
            'lastName',
            'email',
          );
          expect(res.body.username).to.equal(username);
          expect(res.body.firstName).to.equal(firstName);
          expect(res.body.lastName).to.equal(lastName);
          return User.findOne({
            username,
          });
        })
        .then((user) => {
          expect(user).to.not.be.null;
          expect(user.firstName).to.equal(firstName);
          expect(user.lastName).to.equal(lastName);
        }));
    });

    describe('GET', () => {
      it('Should return an empty array initially', () => chai.request(app).get('/api/users').then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length(0);
      }));
      it('Should return an array of users', () => User.create(
        {
          username,
          password,
          firstName,
          lastName,
          email,
        },
        {
          username: usernameB,
          password: passwordB,
          firstName: firstNameB,
          lastName: lastNameB,
          email: emailB,
        },
      )
        .then(() => chai.request(app).get('/api/users'))
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(2);
          expect(res.body[0]).to.deep.equal({
            username,
            firstName,
            lastName,
            email,
          });
          expect(res.body[1]).to.deep.equal({
            username: usernameB,
            firstName: firstNameB,
            lastName: lastNameB,
            email: emailB,
          });
        }));
    });
  });
});

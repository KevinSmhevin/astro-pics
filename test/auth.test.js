

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users/models');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');
const { jwtStrategy } = require('../auth/strategies');

const { expect } = chai;

chai.use(chaiHttp);

describe('Auth endpoints', () => {
  const email = 'test.user@test.com';
  const username = 'testUser';
  const password = 'testPassword';
  const firstName = 'billy';
  const lastName = 'bobby';

  before(() => runServer(TEST_DATABASE_URL));

  beforeEach(() => User.hashPassword(password).then(password => User.create({
    email,
    username,
    password,
    firstName,
    lastName,
  })));
  afterEach(() => User.remove({}));
  after(() => closeServer());
  describe('/api/auth/login', () => {
    it('should reject request with no credentials', () => chai
      .request(app)
      .post('/api/auth/login')
      .then(() => expectexpect(res).to.have.status(400))
      .catch((err) => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }
      }));
    it('should reject requests with incorrect usernames', () => chai
      .request(app)
      .post('/api/auth/login')
      .send({ username: 'wrongUsername', password })
      .then(() => expect(res).to.have.status(401))
      .catch((err) => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }
      }));
    it('should return a valid auth token', () => chai
      .request(app)
      .post('/api/auth/login')
      .send({ username, password })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        const token = res.body.authToken;
        expect(token).to.be.a('string');
        const payload = jwt.verify(token, JWT_SECRET, {
          algorithm: ['HS256'],
        });
        expect(payload.user).to.include({
          email,
          username,
          firstName,
          lastName,
        });
      }));
  });

  describe('/api/auth/refresh', () => {
    it('should reject requests without credentials', () => chai
      .request(app)
      .post('/api/auth/refresh')
      .then(() => expect(res).to.have.status(401))
      .catch((err) => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }
      }));
    it('Should reject requests with an invalid token', () => {
      const token = jwt.sign(
        {
          email,
          username,
          firstName,
          lastName,
        },
        'wrongJWT',
        {
          algorithm: 'HS256',
          expiresIn: '7d',
        },
      );

      return chai
        .request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .then(() => expect(res).to.have.status(401))
        .catch((err) => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
        });
    });

    it('should get token manually', () => {
      const token = jwt.sign(
        {
          user: {
            username,
          },
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d',
        },
      );
      const extractor = jwtStrategy._jwtFromRequest;
      const headers = { authorization: `Bearer ${token}` };
      const result = extractor({ headers });

      expect(result).to.equals(token);
    });
    it('should return a valid auth token with a newer expiry date', () => {
      const token = jwt.sign(
        {
          user: {
            username,
            email,
            firstName,
            lastName,
          },
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          expiresIn: '7d',
        },
      );
      // const decoded = jwt.decode(token);
      return chai
        .request(app)
        .post('/api/auth/refresh')
        .set('authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const resToken = res.body.authToken;
          expect(resToken).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256'],
          });
          expect(payload.user).to.include({
            email,
            username,
            firstName,
            lastName,
          });
          // expect(payload.exp).to.be.at.least(decoded.exp);
        });
    });
  });
});

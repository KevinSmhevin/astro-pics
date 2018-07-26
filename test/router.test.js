const chai = require('chai');
const chaiHttp = require('chai-http');
// const faker = require('faker');

const { expect } = chai;
const app = require('../server');

chai.use(chaiHttp);

describe('GET endpoint', () => {
  it('should get photos', () => {
    let res;
    return chai.request(app)
      .get('/photos')
      .then((_res) => {
        res = _res;
        expect(res).to.have.status(200);
      });
  });
});

'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const expect = chai.expect 
const app = require('../server')
const should = chai.should();
chai.use(chaiHttp);

describe('GET endpoint', function () {
    it('should get photos', function() {
        let res
        return chai.request(app)
        .get('/photos')
        .then(function(_res) {
            res = _res;
            expect(res).to.have.status(200)
        })
    })
})




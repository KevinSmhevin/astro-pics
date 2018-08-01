const { expect } = require('chai');
const mongoose = require('mongoose');
require('dotenv').config();
const { TEST_DATABASE_URL } = require('../config.js');

describe('database', () => {
  it('connects to the database', () => mongoose.connect(TEST_DATABASE_URL).then(() => {
    expect(true).to.equals(true);
  }));
});

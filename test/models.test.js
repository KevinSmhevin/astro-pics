
const { expect } = require('chai');
const mongoose = require('mongoose');
const { TEST_DATABASE_URL } = require('../config.js');

describe('database', () => {
  it('works', () => mongoose.connect(TEST_DATABASE_URL).then(() => {
    expect(true).to.equals(true);
  }));
});

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/astro-pics';
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/astro-pics-test';
module.exports = { DATABASE_URL, TEST_DATABASE_URL };

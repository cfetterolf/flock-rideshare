const { app } = require('./index');
// let request = require('supertest');

test('Server "smoke" test', () => {
  expect(app).toBeDefined();
});

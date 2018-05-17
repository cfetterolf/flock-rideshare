// Create directory for mongoDB
const fs = require('fs');

const dir = './data';
const env = process.env.NODE_ENV || 'development';

if (env === 'development' && !fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

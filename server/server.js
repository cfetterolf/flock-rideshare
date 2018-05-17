/* eslint-disable no-console */
const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const mongoURL = process.env.MONGODB_URI || 'mongodb://localhost:5000/rideshare';

// Load environment variables from .env file
dotenv.load();

exports.start = () => {
  // Create Express application
  const app = express();
  // Allow cross-origin request
  const corsOptions = {
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    origin: '*',
    allowedHeaders: ['Content-Type', 'Accept', 'X-Requested-With', 'Origin'],
  };


  // express only serves static assets in production
  if (process.env.NODE_ENV === 'production') {
    // Resolve client build directory as absolute path to avoid errors in express
    const path = require('path'); // eslint-disable-line global-require
    const buildPath = path.resolve(__dirname, '../client/build');

    app.use(express.static(buildPath));

    app.get('/', (request, response) => {
      response.sendFile(path.join(buildPath, 'index.html'));
    });
  }


  // Set up express middleware
  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(cookieParser());

  return app;
};

exports.mongoConnection = (app) => {
  // Database connection
  // connect to MongoDB
  mongoose.connect(mongoURL).then(() => {
    const server = http.createServer(app).listen(process.env.PORT || 3001);
    console.log('Listening on port %d', server.address().port);
  }).catch(err => console.log(err));
};

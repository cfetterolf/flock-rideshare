/* eslint-disable no-console */
const server = require('./server');
const nodemailer = require('nodemailer');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./documentation/swagger.json');
const rideController = require('./Controllers/rideController');
const userController = require('./Controllers/userController');
const requestFn = require('request');

let app;

// Start express
// eslint-disable-next-line no-unused-vars
const p1 = new Promise((resolve, reject) => {
  resolve(app = server.start());
});

p1.then((appInitialized) => { server.mongoConnection(appInitialized); });

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.post('/api/uber', (request, response) => {
  if (request.body.fromLat && request.body.fromLng && request.body.toLat && request.body.toLng) {
    let myurl = 'https://api.uber.com/v1.2/estimates/price?start_latitude=slat&start_longitude=slong&end_latitude=elat&end_longitude=elong';
    // 'https://api.uber.com/v1.2/estimates/price?start_latitude=37.7&start_longitude=-122.&end_latitude=37.7&end_longitude=-122.518075'
    myurl = myurl
      .replace('slat', request.body.fromLat)
      .replace('slong', request.body.fromLng)
      .replace('elat', request.body.toLat)
      .replace('elong', request.body.toLng);
    requestFn({
      url: myurl,
      method: 'GET',
      headers: {
        Authorization: process.env.UBER_API_KEY,
        'Accept-Language': 'en_US',
        'Content-type': 'application/json',
      },
    }, (error, responseFn, body) => {
      if (error) {
        console.log(error);
      } else {
        return response.send(body);
      }
    });
  }
});

/*
 * Sends an email from MiddRideShare account to USER_EMAIL
 *
 * Expected request body:
 *    destination:  USER_EMAIL
 *    subject:      subject line of email
 *    html:         body of email, in html form
 */

app.post('/api/email', (request, response) => {
  if (request.get('origin') === process.env.DEV_SERVER || request.get('origin') === process.env.HEROKU_SERVER) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"Middlebury Rideshare" <middrideshare@gmail.com>',
      to: request.body.destination,
      subject: request.body.subject,
      html: request.body.html,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        response.send({ error: err });
      } else {
        response.send({ info });
      }
    });
  } else {
    console.log('There is hackers trying to send emails using on our behalf :(');
  }
});


// Ride routes
app.get('/api/rides', rideController.getAllRides);
app.get('/api/rides/:_id', rideController.getById);
app.put('/api/rides/:_id', rideController.updateRideById);
app.post('/api/rides', rideController.createRide);
app.delete('/api/rides/:_id', rideController.deleteRideById);

// User routes
app.get('/api/users', userController.getAllUsers);
app.get('/api/users/:_id', userController.getUserById);
app.put('/api/users/:_id', userController.isAuthenticated, userController.updateUserById);
app.post('/api/users', userController.createAndAuthenticateUser);
app.get('/logout', userController.logout);

app.post('/api/forgotPass', userController.forgotPass);
app.post('/reset/:token', userController.resetPassword);
app.get('/verify/:id', userController.verify);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.send(err.message);
});


module.exports = {
  app,
};

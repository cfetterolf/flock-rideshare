const User = require('../models/user');
const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});


const AccountVerificationEmail = (user) => {
  // Send an email so that the user can get verified
  const baseurl = process.env.NODE_ENV === 'production' ? process.env.HEROKU_SERVER : process.env.DEV_SERVER;
  // eslint-disable-next-line no-underscore-dangle
  const link = `${baseurl}/verify/${user._id}`;

  const mailOptions = {
    from: '"Middlebury Rideshare" <middrideshare@gmail.com>',
    to: user.email,
    subject: 'FLOCK - Your account registration',
    html: `Welcome Aboard! Please click on the following link, or paste this into your browser to complete the process. 
<br/> <a href=${link}>Verify my email</a> <br/> Once on the login page use your previously created credentials to login! 
 <br /><br /> The FLOCK team`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

exports.getAllUsers = (request, response) => {
  User.getAll((users) => { response.send(users); });
};

exports.getUserById = (request, response) => {
  User.getById(request.params._id, user => response.send(user));
};

exports.updateUserById = (request, response, next) => {
  const userId = request.params._id;
  const user = request.body;

  User.findByIdAndUpdate(userId, user, { new: true }, (error, updatedUser) => {
    if (error) {
      response.send({ status_text: error.message });
      return next(error);
    }
    return response.send(updatedUser);
  });
};

exports.isAuthenticated = (req, res, next) => {
  if (req.cookies.userId) {
    User.getById(req.cookies.userId, (user) => { if (user) { return next(); } });
  } else {
    const err = new Error('You must be logged in to view this page.');
    console.log(err);
  }
};

exports.createAndAuthenticateUser = (request, response, next) => {
// confirm that user typed same password twice
  if (request.body.password && request.body.passwordConf) {
    if (request.body.password !== request.body.passwordConf) {
      const err = new Error('Passwords do not match.');
      err.status = 400;
      response.send({ status_text: 'passwords do not match' });
      return next(err);
    }
  }

  if (request.body.email &&
        request.body.name &&
        request.body.password &&
        request.body.passwordConf) {
    const userData = {
      email: request.body.email,
      name: request.body.name,
      password: request.body.password,
    };

    User.create(userData, (error, user) => {
      if (error) {
        response.send({ status_text: error.message });
        return next(error);
      }
      AccountVerificationEmail(user);
      return response.send({ user, status_text: 'User is not verified, check your email inbox for a verification email' });
    });
  } else if (!request.body.name && !request.body.passwordConf &&
      request.body.password && request.body.email) {
    User.authenticate(request.body.email, request.body.password, (error, user) => {
      if (error || !user) {
        const err = new Error('Wrong email or password.');
        err.status = 401;
        response.send({ status_text: 'Wrong email or password.' });
        return next(err);
      } else if (!user.isVerified) {
        AccountVerificationEmail(user);
        return response.send({ user, status_text: 'User is not verified, check your email inbox for a verification email' });
      }
      return response.redirect(`/api/users/${user._id}`);
    });
  } else {
    const err = new Error('All fields required.');
    err.status = 400;
    response.send({ status_text: 'All fields required.' });
    return next(err);
  }
};

exports.logout = (request, response, next) => {
  if (request.session) {
    // delete session object
    request.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      return response.redirect('/');
    });
  }
  return response.redirect('/');
};

exports.verify = (request, response, next) => {
  const { id } = request.params;
  const baseurl = process.env.NODE_ENV === 'production' ? process.env.HEROKU_SERVER : 'http://localhost:3000';

  User.findByIdAndUpdate(id, { isVerified: true }, (error) => {
    if (error) {
      response.send({ status_text: error.message });
      return next(error);
    }
    return response.redirect(baseurl);
  });
};

exports.forgotPass = (req, res, next) => {
  const baseurl = process.env.NODE_ENV === 'production' ? process.env.HEROKU_SERVER : 'http://localhost:3000';

  async.waterfall([
    (done) => {
      crypto.randomBytes(16, (err, buf) => {
        const token = buf.toString('hex');
        done(err, token);
      });
    },
    (token, done) => {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          return res.status(400).send({ msg: `The email address ${req.body.email} is not associated with any account.` });
        }
        const updatedUser = {
          passwordResetToken: token,
          passwordResetExpires: Date.now() + 3600000, // expire in 1 hour
        };
        User.findByIdAndUpdate(user._id, updatedUser, { new: true }, (error, theUpdatedUser) => {
          if (error) {
            res.send({ status_text: error.message });
            return next(error);
          }
          done(error, token, theUpdatedUser);
        });
      });
    },
    (token, user, done) => {
      const mailOptions = {
        to: user.email,
        from: '"Middlebury Rideshare" <middrideshare@gmail.com>',
        subject: '✔ FLOCK - Reset your password',
        html: `${'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                ''}${baseurl}/#/reset/${token}\n\n` +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      };
      transporter.sendMail(mailOptions, (err) => {
        res.send({ msg: `An email has been sent to ${user.email} with further instructions.` });
        done(err);
      });
    },
  ]);
};

exports.resetPassword = (req, res, next) => {
  if (req.body.password !== req.body.passwordConf) {
    const err = new Error('Passwords do not match.');
    err.status = 400;
    res.send({ status_text: 'passwords do not match' });
    return next(err);
  }

  async.waterfall([
    (done) => {
      User.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec((err, user) => {
          if (!user) {
            return res.status(400).send({ msg: 'Password reset token is invalid or has expired.' });
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save((error) => {
            done(error, user);
          });
        });
    },
    (user, done) => {
      const mailOptions = {
        from: '"Middlebury Rideshare" <middrideshare@gmail.com>',
        to: user.email,
        subject: 'FLOCK - Your password has been changed',
        html: `${'Hello,\n\n' +
                'This is a confirmation that the password for your account '}${user.email} has just been changed.\n`,
      };
      transporter.sendMail(mailOptions, (err) => {
        res.send({ msg: 'Your password has been changed successfully.' });
        done(err);
      });
    },
  ]);
};

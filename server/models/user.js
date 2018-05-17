const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Not the final model, still discussing it
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    validate: {
      validator(v) {
        return /\b[A-Z0-9a-z._%+-]+@middlebury.edu\b/.test(v);
      },
      message: '{VALUE} is not a valid middlebury email address!',
    },
    required: [true, 'A valid middlebury email address is required'],
    trim: true,
  },
  studentId: {
    type: Number,
    required: false,
  },
  car: {
    type: String,
    required: false,
  },
  phone: {
    type: Number,
    required: false,
  },
  phoneProvider: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'A password is required'],
  },
  isVerified: { type: Boolean, default: false },
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  collection: 'users',
  versionKey: false,
});


UserSchema.statics = {
  authenticate(email, password, callback) {
    this.findOne({ email })
      // eslint-disable-next-line consistent-return
      .exec((err, user) => {
        if (err) {
          return callback(err);
        } else if (!user) {
          const error = new Error('User not found.');
          error.status = 401;
          return callback(error);
        }
        bcrypt.compare(password, user.password, (erro, result) => {
          if (result === true) {
            return callback(null, user);
          }
          return callback();
        });
      });
  },
  getById(_id, callback) {
    return this.findById({ _id })
      .exec((err, user) => {
        if (err) {
          return callback(err);
        } else if (!user) {
          const error = new Error('user not found.');
          error.status = 401;
          return callback(error);
        }
        return callback(user);
      });
  },
  getAll(callback) {
    return this.find()
      .exec((err, users) => {
        if (err) {
          return callback(err);
        } else if (!users) {
          const error = new Error('users not found.');
          error.status = 401;
          return callback(error);
        }
        return callback(users);
      });
  },
};

// hashing a password before saving it to the database
// eslint-disable-next-line func-names
UserSchema.pre('save', function (next) {
  const user = this;
  // eslint-disable-next-line consistent-return
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});


const User = mongoose.model('User', UserSchema);
module.exports = User;

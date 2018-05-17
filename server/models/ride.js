const mongoose = require('mongoose');

// Not the final model, still discussing it
const RideSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['offer', 'request'],
  },
  studentID: {
    type: String,
    required: false,
  },
  fulfilled: {
    type: Boolean,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  fromgeo: {
    type: Object,
    required: false,
  },
  to: {
    type: String,
    required: true,
  },
  togeo: {
    type: Object,
    required: false,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  passengers: {
    type: [String],
    required: false,
  },
  // Do we add a max number of seats
  seats_avail: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  user: {
    type: String,
    required: true,
  },
}, {
  collection: 'rides',
  versionKey: false,
});

RideSchema.statics = {
  getById(_id, callback) {
    return this.findById({ _id })
      .exec((err, ride) => {
        if (err) {
          return callback(err);
        } else if (!ride) {
          const error = new Error('Ride not found.');
          error.status = 401;
          return callback(error);
        }
        return callback(ride);
      });
  },
  delById(_id, callback) {
    return this.findByIdAndRemove({ _id })
      .exec((err, ride) => {
        if (err) {
          return callback(err);
        } else if (!ride) {
          const error = new Error('Ride not found.');
          error.status = 401;
          return callback(error);
        }
        return callback(ride);
      });
  },
  getAll(callback) {
    return this.find()
      .exec((err, rides) => {
        if (err) {
          return callback(err);
        } else if (!rides) {
          const error = new Error('Rides not found.');
          error.status = 401;
          return callback(error);
        }
        return callback(rides);
      });
  },
};


const Ride = mongoose.model('Ride', RideSchema);
module.exports = Ride;

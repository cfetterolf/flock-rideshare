const Ride = require('../models/ride');


exports.getAllRides = (request, response) => {
  Ride.getAll((rides) => { response.send(rides); });
};

exports.getById = (request, response) => {
  Ride.getById(request.params._id, (ride) => { response.send(ride); });
};

exports.updateRideById = (request, response, next) => {
  const rideId = request.params._id;
  const ride = request.body;

  Ride.findByIdAndUpdate(rideId, ride, { new: true }, (error, updatedRide) => {
    if (error) {
      response.send({ status_text: error.message });
      return next(error);
    }
    return response.send(updatedRide);
  });
};

exports.createRide = (request, response, next) => {
  Ride.create(request.body, (error, newRide) => {
    if (error) {
      response.send({ status_text: error.message });
      return next(error);
    }
    return response.send(newRide);
  });
};

exports.deleteRideById = (request, response) => {
  Ride.delById(request.params._id, (ride) => { response.send(ride); });
};

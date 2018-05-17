/*
    displays the offers and requests belonging to the user logged in
      and gives the option to delete offers/requests

    props:
      rides: list of all rides
      type: type of page selected (either requests or offers)
      user: current user logged in
      deleteRide: callback to delete ride by id
      cancelReservation: callback to cancel user reservation of ride

    called in:
      Profile.js

*/


import React from 'react';
import PropTypes from 'prop-types';
import RideContainer from '../../ridesContainer/ridesComponents/rideContainer/RideContainer';
import { rideType } from '../../../types';

/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

export default class ProfileRides extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDetail: null,
    };
  }

  setCurrent(currentID) {
    if (currentID === this.state.currentDetail) { // if the one that is clicked is already open
      this.setState({ currentDetail: null }); // close it by setting it to null
    } else {
      this.setState({ currentDetail: currentID });
    }
  }

  render() {
    let listRides = '';
    // handle cancel a reservation
    if (this.props.type === 'reserved_rides') {
      listRides = this.props.rides.filter(ride =>
        ride.passengers.indexOf(this.props.user) > -1).map((ride) => {
        if (ride.type === 'offer') {
          return (
            <RideContainer
              {...this.props}
              current={this.state.currentDetail}
              setCurrent={newCurrent => this.setCurrent(newCurrent)}
              key={ride._id} // eslint-disable-line no-underscore-dangle
              {...ride}
              map={false}
              deleteRide={this.props.deleteRide}
              cancelReservation={this.props.cancelReservation}
              profileMode
            />
          );
        }
        return (<div key={ride._id} />);
      });
    } else {
      listRides = this.props.rides.filter(ride => ride.user === this.props.user).map((ride) => {
        if (ride.type === this.props.type) {
          return (
            <RideContainer
              {...this.props}
              current={this.state.currentDetail}
              setCurrent={newCurrent => this.setCurrent(newCurrent)}
              key={ride._id} // eslint-disable-line no-underscore-dangle
              {...ride}
              map={false}
              deleteRide={this.props.deleteRide}
              profileMode

            />
          );
        }
        return (<div key={ride._id} />); // eslint-disable-line no-underscore-dangle
      });
    }

    return (
      <div>
        {listRides}
      </div>
    );
  }
}

ProfileRides.propTypes = {
  rides: PropTypes.arrayOf(rideType),
  type: PropTypes.string,
  user: PropTypes.string.isRequired,
  deleteRide: PropTypes.func.isRequired,
  cancelReservation: PropTypes.func,
};

ProfileRides.defaultProps = {
  rides: [],
  type: 'request',
  cancelReservation: () => {},
};

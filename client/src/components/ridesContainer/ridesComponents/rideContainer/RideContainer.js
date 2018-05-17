/*
toggles between RideDetail or RideSummary for each ride

props:
    current: the "current" ride selected
    setCurrent: callback to update the "current" ride selected (could be set to null)
    setToGeo: callback to set the destination location
    setFromGeo: callback to set the origin location
    key: unique ._id of each ride
    all props of ride
    map: boolean to show locations on map when user clicks on a ride
    deleteRide: callback to delete ride by id
    cancelReservation: callback to cancel a ride reservation

called in:
    RideTable.js
*/

import React from 'react';
import { PropTypes, string } from 'prop-types';
import RideSummary from './RideSummary';
import RideDetail from './detailContainer/RideDetail';

/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

class RideContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: this.props.user,

    };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    fetch(`/api/users/${this.state.currentUser}`, { headers: new Headers({ Accept: 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((data) => { // filter out rides that already expired
        this.setState({ currentUser: data });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  handleClick() {
    // eslint-disable-next-line no-underscore-dangle
    if (this.props.map) {
      this.props.setToGeo(this.props.togeo);
      this.props.setFromGeo(this.props.fromgeo);
    }
    this.props.setCurrent(this.props._id);
    // console.log(this.props.fromgeo);
  }

  render() {
    // eslint-disable-next-line no-underscore-dangle
    const View = (this.props.current === this.props._id) ? RideDetail : RideSummary;
    return (
      <div style={{ marginTop: '10px' }}>
        <View
          cuser={this.state.currentUser}
          {...this.props}
          onClick={this.handleClick}
          deleteRide={this.props.deleteRide}
          cancelReservation={this.props.cancelReservation}
        />
      </div>
    );
  }
}
RideContainer.propTypes = {
  setCurrent: PropTypes.func.isRequired,
  setToGeo: PropTypes.func.isRequired,
  setFromGeo: PropTypes.func.isRequired,
  setCenter: PropTypes.func.isRequired,
  _id: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  map: PropTypes.bool.isRequired,
  fromgeo: PropTypes.arrayOf(PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  })).isRequired,
  togeo: PropTypes.arrayOf(PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  })).isRequired,
  ride: PropTypes.shape({
    user: PropTypes.string.isRequired,
  }).isRequired,
  deleteRide: PropTypes.func.isRequired,
  cancelReservation: PropTypes.func.isRequired,
};

RideContainer.propTypes = {
  user: string.isRequired,
};

export default RideContainer;

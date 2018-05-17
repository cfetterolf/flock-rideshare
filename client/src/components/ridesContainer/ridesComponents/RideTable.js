/*
creates a RideContainer for each ride

props:
    router props
    logoutSuccess: callback for handling user logouts
    rides: list of all rides
    currentDetail: the "current" ride selected
    setCurrent: callback to update the "current" ride selected (could be set to null)
    setToGeo: callback to set the destination location
    setFromGeo: callback to set the origin location
    deleteRide: callback to delete ride by id
    cancelReservation: callback to cancel a ride reservation

called in:
    RideTableContainer.js

*/
import React from 'react';
import PropTypes from 'prop-types';
import RideContainer from './rideContainer/RideContainer';

function RideTable(props) {
  const listRides = props.rides.map(ride => (
    <div style={{ display: !ride.fulfilled ? 'block' : 'none' }}>
      <RideContainer
        {...props}
        current={props.currentDetail}
        setCurrent={newCurrent => props.setCurrent(newCurrent)}
        setToGeo={newToGeo => props.setToGeo(newToGeo)}
        setFromGeo={newFromGeo => props.setFromGeo(newFromGeo)}
        key={ride._id} // eslint-disable-line no-underscore-dangle
        {...ride}
        map
        deleteRide={props.deleteRide}
        cancelReservation={props.cancelReservation}
      />
    </div>
  ));

  return (
    <div style={{ overflowY: 'scroll', height: 'calc(100vh - 200px)', padding: '0px 10px 0 10px' }}>
      {listRides}
    </div>
  );
}

RideTable.propTypes = {
  rides: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,

  })).isRequired,
  currentDetail: PropTypes.string, // eslint
  deleteRide: PropTypes.func.isRequired,
  cancelReservation: PropTypes.func.isRequired,
};

RideTable.defaultProps = {
  currentDetail: null,
};

export default RideTable;

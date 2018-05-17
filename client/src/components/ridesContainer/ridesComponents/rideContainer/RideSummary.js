/*
displays summary of a ride (title; date; seats available)

props:
    all props of ride
    cuser: current user logged in
    {...this.props}
    onClick: callback to toggle betwen RideSummary and RideDetail
    deleteRide: callback to delete ride by id
    cancelReservation: callback to cancel a ride reservation

called in:
    RideContainer.js
*/

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
// import { colors } from '../css/colors';

const NestedSummary = styled.div`
margin: 0;
background-color: white;
padding: 15px;
margin-top: 5px;
margin-bottom: 5px;
border-radius: 8px;
`;

const Summary = styled.div`
margin: 0;
background-color: white;
padding: 15px;
margin-top: 5px;
margin-bottom: 5px;
border-radius: 8px;
box-shadow: 0 1px 5px rgba(0,0,0,0.3);
transition: all 0.3s cubic-bezier(.25,.8,.25,1);
&:hover {
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  cursor: pointer;
}
`;


const Date = styled.p`
margin: 0px;
padding-left: 1em;
`;

const SeatsAvailable = styled.p`
margin:0px;
padding-left: 1em;
font-size:smaller;
`;

const inlineStyle = {
  fontWeight: 'bold',
  width: '50px',
  display: 'inline-block',
};

function RideSummary(props) {
  const rideName = (
    <div>
      <div>
        <span style={inlineStyle}>From:</span>
        {props.from}
      </div>
      <div>
        <span style={inlineStyle}>To:</span>
        {props.to}
      </div>
    </div>
  );

  const seatDisplay = (props.type === 'offer') ? 'Seats Available' : 'Seats Needed';
  const rideInfo = (
    <div>
      {rideName}
      <Date>({props.date})</Date>
      <SeatsAvailable>{seatDisplay}: {props.seats_avail}</SeatsAvailable>
    </div>
  );
  if (props.nested) {
    return (
      <NestedSummary onClick={() => props.onClick()}>
        {rideInfo}
      </NestedSummary>
    );
  }

  return (
    <Summary onClick={() => props.onClick()}>
      {rideInfo}
    </Summary>
  );
}

RideSummary.propTypes = {
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  seats_avail: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  nested: PropTypes.bool,
};

RideSummary.defaultProps = {
  nested: false,
};

export default RideSummary;

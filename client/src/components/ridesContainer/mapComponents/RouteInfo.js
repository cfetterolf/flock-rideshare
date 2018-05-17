/*

*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const infoStyle = {
  width: '100%',
};

const Type1 = styled.p`
      font-size: 18px;
      margin-top: 15px;
      margin-bottom: 0;
      font-weight: 300;
      text-align: center;
    `;

const Subtitle = styled.div`
    font-weight:bold;
    display: inline;
    `;

const Detail = styled.div`
    padding: 10px;
    clear: both;
    background: white;
    border-radius: 8px;
    `;

const getHours = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  const hours = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
  const minutes = m > 0 ? m + (m === 1 ? ' minute ' : ' minutes ') : '';
  return hours + minutes;
};

/*
 * props:
 *    routeInfo: route info object from Google Maps API
 *    timeDif: difference in time if there's a waypoint, null otherwise
 *    currentDetail: current selected route
 */
function RouteInfo(props) {
  const distance = props.routeInfo ?
    `${props.routeInfo.dist} miles` : '';

  const duration = props.routeInfo ?
    props.routeInfo.duration : '';

  const timeDif = props.timeDif ? (
    <div>
      <Subtitle>Extra time added by stop: </Subtitle>
      {getHours(props.timeDif)}
    </div>
  ) : <div />;

  let routeInfo;
  // if there is a ride selected and the route info has rendered
  if (props.currentDetail) {
    if (props.routeInfo) {
      routeInfo = (
        <div>
          <div>
            <Subtitle>Distance of route: </Subtitle>
            {distance}
          </div>
          <div>
            <Subtitle>Driving time of route: </Subtitle>
            {duration}
          </div>
          {timeDif}
        </div>
      );
    }
  } else { // if there is no current ride
    routeInfo = (
      <Type1>
                Click a ride to view route information!
      </Type1>
    );
  }


  return (
    <div>
      <Detail style={infoStyle}>
        {routeInfo}
      </Detail>
    </div>
  );
}

RouteInfo.defaultProps = {
  currentDetail: null,
  routeInfo: undefined,
  timeDif: null,
};

RouteInfo.propTypes = {
  currentDetail: PropTypes.string,
  routeInfo: PropTypes.shape({
    dist: PropTypes.number.isRequired,
    duration: PropTypes.string.isRequired,
  }),
  timeDif: PropTypes.number,
};


export default RouteInfo;

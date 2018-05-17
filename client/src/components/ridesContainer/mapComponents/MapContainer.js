/*
Code Source: https://github.com/google-map-react/google-map-react/issues/457

Component implementing the Google Maps API. This component renders a google map
that corresponds to selected rides to display routes corresponding to the rides.
The map also corresponds to a search bar that can be used to add "waypoints" along
a route when a given ride is selected. This map supports zooming, dragging, and
re-centering.

props:
    currentToGeo: current destination location
    currentFromGeo: current origin location
    searchedLocation: the location search term searched by user
    setRouteInfo: callback to set routeInfo state in RideTableContainer

called in:
    RideTableContainer.js
*/

import React from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';

const bootstrapURLKeys = { key: 'AIzaSyCCcm1_IdCQxK6VPbkwprS2ya3BT_o7mI4' };
const mapStyle = { // MUST specify dimensions of the Google map or it will not work
  width: '100%',
  height: '100%',
};

// Direction Service objects. ref:
//    https://developers.google.com/maps/documentation/javascript/directions
let directionsDisplay;
let directionsService;
let dist = null;
let duration = null;
let waypointSelected = false;

// Get total distance from the different legs of route
const getTotalDistance = (legs) => {
  let distance = 0;
  for (let i = 0; i < legs.length; i += 1) {
    distance += legs[i].distance.value * 0.000621371192; // convert meter to mi
  }
  return Math.ceil(distance);
};

// https://stackoverflow.com/questions/37096367/how-to-convert-seconds-to-minutes-and-hours-in-javascript
// Get total duration from the different legs of route
const getHours = (legs) => {
  let seconds = 0;
  // have to get integer/seconds value for duration so it can be summed
  // for each leg of the trip
  for (let i = 0; i < legs.length; i += 1) {
    seconds += legs[i].duration.value;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  const hours = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
  const minutes = m > 0 ? m + (m === 1 ? ' minute ' : ' minutes ') : '';
  return hours + minutes;
};

// Find central point on map based on route points
const findCenter = (props) => {
  if (props.currentToGeo && props.currentFromGeo) {
    const newLat = (props.currentToGeo.lat + props.currentFromGeo.lat) / 2;
    const newLng = (props.currentToGeo.lng + props.currentFromGeo.lng) / 2;
    return ({ lat: newLat, lng: newLng });
  }
  return ({ lat: 44.0082633, lng: -73.1795039 }); // center on Middlebury
};

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      maps: null,
      prev_time: null,
    };

    this.showDirections = this.showDirections.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentToGeo !== nextProps.currentToGeo ||
        this.props.currentFromGeo !== nextProps.currentFromGeo ||
        this.props.searchedLocation !== nextProps.searchedLocation) {
      this.showDirections(
        nextProps.currentFromGeo,
        nextProps.currentToGeo,
        nextProps.searchedLocation,
      );
    }
  }

  showDirections(fromMarker, toMarker, searchMarker) {
    // No ride selected, remove the route
    if (!fromMarker || !toMarker) {
      if (directionsDisplay) {
        directionsDisplay.setMap(null);
      }
      return;
    }

    if (this.state.map) {
      // remove previous directions/pins
      if (directionsDisplay) {
        directionsDisplay.setMap(null);
      }

      // create our new directions
      directionsService = new this.state.maps.DirectionsService();
      directionsDisplay = new this.state.maps.DirectionsRenderer();

      // Look for midway point
      let waypoints;
      if (searchMarker) {
        waypoints = [{
          location: searchMarker,
          stopover: true,
        }];
        waypointSelected = true;
      } else {
        waypointSelected = false;
      }

      directionsService.route({
        waypoints,
        origin: fromMarker,
        destination: toMarker,
        travelMode: 'DRIVING',
      }, (response, status) => {
        if (status === 'OK') {
          // set new directions
          directionsDisplay.setMap(this.state.map);
          directionsDisplay.setDirections(response);
          dist = getTotalDistance(response.routes[0].legs);
          duration = getHours(response.routes[0].legs);

          // compute total seconds for our diff calculation
          let seconds = 0;
          for (let i = 0; i < response.routes[0].legs.length; i += 1) {
            seconds += response.routes[0].legs[i].duration.value;
          }

          // Compute the extra time added by waypoint
          let timeDif;
          if (this.state.prev_time && waypointSelected) {
            timeDif = seconds - this.state.prev_time;
          }

          this.setState({ prev_time: seconds });

          // callback to set state in RideTableContainer so data can be shown
          this.props.setRouteInfo({ dist, duration }, timeDif);
        }
      });
    }
  }

  apiIsLoaded(map) {
    if (map) {
      GoogleMapReact.googleMapLoader(bootstrapURLKeys)
        .then((maps) => {
          this.setState({ map, maps });
        });
    }
  }

  render() {
    return (
      <div className="google-map" style={mapStyle}>
        <GoogleMapReact
          bootstrapURLKeys={bootstrapURLKeys}
          center={findCenter(this.props)}
          defaultZoom={6}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map }) => this.apiIsLoaded(map)}
        />
      </div>


    );
  }
}

MapContainer.propTypes = {
  currentToGeo: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  currentFromGeo: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  searchedLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  setRouteInfo: PropTypes.func.isRequired,
};

MapContainer.defaultProps = {
  currentToGeo: null,
  currentFromGeo: null,
  searchedLocation: null,
};

export default MapContainer;

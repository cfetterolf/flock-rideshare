/*
a container that handles map components and search box components

props:
    router props
    logoutSuccess: callback for handling user logouts
    rides: list of all rides
    type: type of tab toggle (either "offer" or "request")
    deleteRide: callback to delete ride by id
    cancelReservation: callback to cancel ride reservation

called in:
    Ride.js

*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactRouterPropTypes from 'react-router-prop-types';
import RideTable from './ridesComponents/RideTable';
import SearchBox from './searchComponents/SearchBox';
import MapContainer from './mapComponents/MapContainer';
import MapSearchBar from './mapComponents/MapSearchBar';
import RouteInfo from './mapComponents/RouteInfo';
import { colors } from '../../css/colors';

const RideHeader = styled.p`
  font-size: 20px;
  font-weight: 500;
  position:relative;
  margin: 5px 0 0 0;
  height: 20px;
`;

const Type1 = styled.p`
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 0;
  font-weight: 300;
  text-align: center;
`;

const BottomButton = styled.div`
  padding: 10px 0 10px 0;
  text-align: center;
`;

const rowStyle = {
  marginLeft: '0',
  width: '100%',
  borderRadius: '10px',
  backgroundColor: colors.off_white,
  boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
  overflow: 'hidden',
};

const filterBarStyle = {
  margin: '0',
  height: 'auto',
  padding: '.5rem 1rem',
  borderBottom: 'solid rgba(0,0,0,0.3) 1px',
  backgroundColor: 'white',
  boxShadow: '0 2px 3px rgba(0,0,0,0.15)',
};

const mapStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  bottom: '100px',
};

const routeInfoStyle = {
  position: 'absolute',
  bottom: '0',
  height: '110px',
  backgroundColor: 'white',
  borderTop: 'solid #999999 1px',
  width: '100%',
};

const rideContainerStyle = {
  borderRightStyle: 'solid',
  borderRightWidth: 'thin',
  borderRightColor: 'darkgrey',
};


class RideTableContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      sortType: 'to',
      searchType: 'both',
      currentDetail: null,
      currentToGeo: null,
      currentFromGeo: null,
      searchedLocation: null,
      routeInfo: null,
      startDate: '',
      endDate: '',
    };
  }

  // Callback function to be called in RideContainer when a ride (either offer or request)
  // is clicked. This function sets the state of this component so that
  // there is a "current" ride
  setCurrent(currentID) {
    if (currentID === this.state.currentDetail) { // if the one that is clicked is already open
      this.setState({ currentDetail: null }); // close it by setting it to null
    } else {
      this.setState({ currentDetail: currentID });
    }
  }

  setToGeo(toGeo) {
    if (toGeo === this.state.currentToGeo) {
      this.setState({ currentToGeo: null, searchedLocation: null });
    } else {
      this.setState({ currentToGeo: toGeo });
    }
  }

  setFromGeo(fromGeo) {
    if (fromGeo === this.state.currentFromGeo) {
      this.setState({ currentFromGeo: null, searchedLocation: null });
    } else {
      this.setState({ currentFromGeo: fromGeo });
    }
  }


  render() {
    const isAllSearch = this.state.searchType === '' || this.state.searchType === 'both';
    let listRides = this.props.rides.slice(0);

    const start = new Date(this.state.startDate);
    const end = new Date(this.state.endDate);

    if (this.state.startDate !== '') {
      listRides = listRides.filter(ride => new Date(ride.date) >= start);
    }
    if (this.state.endDate !== '') {
      listRides = listRides.filter(ride => new Date(ride.date) <= end);
    }

    if (this.state.searchTerm) {
      const term = this.state.searchTerm.toLowerCase();
      listRides = listRides.filter((ride) => {
        const includesTo = (ride.to.toLowerCase()).includes(term);
        const includesFrom = (ride.from.toLowerCase()).includes(term);
        return (includesTo && this.state.searchType === 'to') ||
        (includesFrom && this.state.searchType === 'from') ||
        (isAllSearch && (includesTo || includesFrom));
      });
    }

    if (this.state.sortType) {
      listRides = (this.state.searchTerm) ? listRides : listRides.slice();
      const field = this.state.sortType;
      listRides.sort((m1, m2) => {
        if (m1[field] < m2[field]) {
          return -1;
        } else if (m1[field] === m2[field]) {
          return 0;
        }
        return 1;
      });
    }

    const title = this.props.type === 'request' ? 'EXISTING OFFERS' : 'EXISTING REQUESTS';
    const subtitle = this.props.type === 'request' ? (
      'Looking for something else?'
    ) : (
      'Planning a trip?'
    );

    const displayBar = this.state.currentDetail ? 'block' : 'none';
    const mapSearchBar = (
      <div style={{ display: displayBar, marginTop: '15px' }}>
        <MapSearchBar
          searchedLocation={loc => this.setState({ searchedLocation: loc })}
          displayText="Add a stop to the route"
        />
      </div>
    );


    // new request and offer buttons
    const newRideBtn = (
      <input
        type="button"
        className="btn btn-primary"
        value={this.props.type === 'offer' ? 'Offer a Ride' : 'Request a Ride'}
        style={{ marginTop: '0', display: 'inline-block' }}
        onClick={() => { this.props.history.push(`/new/ride/${this.props.type}/1`); }} // Request.js
      />
    );

    return (
      <div style={{ padding: '.5rem 2rem' }}>
        <div className="row" style={rowStyle}>
          <div className="col-md-6" style={rideContainerStyle}>
            <div>
              <div className="row" style={filterBarStyle}>
                <RideHeader>{title}</RideHeader>
                <hr style={{ width: '100%', margin: '5px 50% 5px 0px' }} />
                <SearchBox
                  searchTerm={this.state.searchTerm}
                  setTerm={(term) => { this.setState({ searchTerm: term }); }}
                  sortType={this.state.sortType}
                  searchType={this.state.searchType}
                  setType={(type) => { this.setState({ sortType: type }); }}
                  setSearchType={(type) => { this.setState({ searchType: type }); }}
                  setStartDate={(date) => { this.setState({ startDate: date }); }}
                  setEndDate={(date) => { this.setState({ endDate: date }); }}
                />
              </div>
              <RideTable
                {...this.props}
                rides={listRides}
                currentDetail={this.state.currentDetail}
                setCurrent={newCurrent => this.setCurrent(newCurrent)}
                setToGeo={newToGeo => this.setToGeo(newToGeo)}
                setFromGeo={newFromGeo => this.setFromGeo(newFromGeo)}
                deleteRide={this.props.deleteRide}
                cancelReservation={this.props.cancelReservation}
              />
              <div style={{ borderTop: 'solid #999999 1px', backgroundColor: 'white', height: '110px' }}>
                <Type1>{subtitle}</Type1>
                <BottomButton>{newRideBtn}</BottomButton>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div style={mapStyle}>
              <MapContainer
                currentToGeo={this.state.currentToGeo}
                currentFromGeo={this.state.currentFromGeo}
                searchedLocation={this.state.searchedLocation}
                setRouteInfo={(routeInfo, timeDif) =>
                  this.setState({ routeInfo, timeDif })
                }
              />
            </div>
            <div style={routeInfoStyle}>
              <RouteInfo
                routeInfo={this.state.routeInfo}
                timeDif={this.state.timeDif}
                currentDetail={this.state.currentDetail}
              />
            </div>
            <div style={{ position: 'absolute', left: '10px', right: '10px' }}>
              {mapSearchBar}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

RideTableContainer.defaultProps = {
  searchTerm: undefined,
  sortType: undefined,
  cancelReservation: () => {},
};

RideTableContainer.propTypes = {
  rides: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
  })).isRequired,
  searchTerm: PropTypes.string,
  sortType: PropTypes.string,
  deleteRide: PropTypes.func.isRequired,
  cancelReservation: PropTypes.func,
  type: PropTypes.string.isRequired,
  history: ReactRouterPropTypes.history.isRequired, // eslint-disable-line react/no-typos
};

export default RideTableContainer;

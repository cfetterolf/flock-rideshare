/*
  displays the list of rides; the home page

  props:
    router props
    logoutSuccess: callback for handling user logouts

*/

/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import React, { Component } from 'react';
import cookie from 'react-cookies';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Avatar from 'react-avatar';
import '../css/Login.css';
import '../css/Ride.css';
import '../css/react-tabs.css';
import RideTableContainer from './ridesContainer/RideTableContainer';

const Background = styled.div`
background: #eee url(https://subtlepatterns.com/patterns/extra_clean_paper.png);
width: 100%;
height: 100vh;
display: grid;
`;

const TabText = styled.p`
font-size: 18px;
font-weight: bold;
`;

const AvatarMargin = styled.div`
position: absolute;
right: 5%;
float:right;
margin-bottom: 20px !important;
`;


class Ride extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rides: [],
      currentUser: '',
      tab: 'request',
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  // get all the rides from the server
  componentDidMount() {
    fetch('/api/rides/', { headers: new Headers({ Accept: 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((data) => { // filter out rides that already expired
        this.setState({ rides: data === undefined ? data : data.filter(this.notExpired) });
        this.sortRides();
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
    const usid = cookie.load('userId');

    // get the current user
    fetch(`/api/users/${usid}`, { headers: new Headers({ Accept: 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ currentUser: data.name });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  // sort rides by dates (rides expiring earlier first)
  sortRides() {
    if (this.state.rides !== undefined) {
      const ridesCopy = this.state.rides.slice(0);
      ridesCopy.sort((a, b) => {
        const dateString1 = `${a.date}T${a.time}:00`;
        const dateString2 = `${b.date}T${b.time}:00`;
        let date1 = new Date(dateString1);
        let date2 = new Date(dateString2);
        date1 = isNaN(date1.getTime()) ? new Date(a.date) : date1; // eslint-disable-line no-restricted-globals, max-len
        date2 = isNaN(date2.getTime()) ? new Date(b.date) : date2; // eslint-disable-line no-restricted-globals, max-len

        return date1 - date2;
      });
      this.setState({ rides: ridesCopy });
    }
  }


  // delete a ride by id from the server
  handleDeleteRide(id) {
    fetch(`/api/rides/${id}`, { // update already existing article
      method: 'DELETE',
      headers: new Headers({ 'Content-type': 'application/json' }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.status_text);
      }
      // update state's collction
      const updatedRides =
        this.state.rides.filter(ride => ride._id !== id); // eslint-disable-line no-underscore-dangle, max-len
      this.setState({ rides: updatedRides });
    }).catch(err => console.log(err)); // eslint-disable-line no-console
  }

  // allows user to cancel a ride reservation
  handleCancelReservation(newRide) {
    fetch(`/api/rides/${newRide._id}`, {
      method: 'PUT',
      body: JSON.stringify(newRide),
      headers: new Headers({ 'Content-type': 'application/json' }),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.status_text);
    }).then((fetchedRide) => {
      // Create a copy of the rides, replacing the current ride if this is a cancel
      const updatedRides = this.state.rides.map(ride =>
        ((ride._id === fetchedRide._id) ? fetchedRide : ride));
      this.setState({ rides: updatedRides });
    }).catch(err => console.log(err)); // eslint-disable-line no-console
  }

  // filters out expired rides
  notExpired(ride) { // eslint-disable-line class-methods-use-this
    const now = new Date();
    const dateTimeString = `${ride.date}T${ride.time}:00`;
    let dateOfRide = new Date(dateTimeString);
    // handing rides with no specified time:
    dateOfRide = isNaN(dateOfRide.getTime()) ? new Date(ride.date) : dateOfRide; // eslint-disable-line no-restricted-globals, max-len

    return dateOfRide >= now && !isNaN(dateOfRide.getTime()); // eslint-disable-line no-restricted-globals, max-len
  }


  // eslint-disable-next-line class-methods-use-this
  handleLogout() {
    this.props.logoutSuccess();
  }

  render() {
    function ridesRequested(item) {
      if (item.type === 'request') {
        return true;
      }
      return false;
    }
    function ridesOffered(item) {
      if (item.type === 'offer') {
        return true;
      }
      return false;
    }
    let rideContents = (<h2>Loading...</h2>);
    if (this.state.rides !== undefined && this.state.rides.length > 0) {
      if (this.state.tab === 'offer') {
        rideContents = (<RideTableContainer
          {...this.props}
          rides={this.state.rides.filter(ridesRequested)}
          type={this.state.tab}
          deleteRide={(id) => { this.handleDeleteRide(id); }}
          cancelReservation={(newRide) => { this.handleCancelReservation(newRide); }}
        />);
      } else {
        rideContents = (<RideTableContainer
          {...this.props}
          rides={this.state.rides.filter(ridesOffered)}
          type={this.state.tab}
          deleteRide={(id) => { this.handleDeleteRide(id); }}
          cancelReservation={(newRide) => { this.handleCancelReservation(newRide); }}
        />);
      }
    }

    const FindOfferTabs = (
      <Tabs>
        <TabList>
          <Tab onClick={() => this.setState({ tab: 'request' })}><TabText>FIND A RIDE</TabText></Tab>
          <Tab onClick={() => this.setState({ tab: 'offer' })}><TabText>OFFER A RIDE</TabText></Tab>
        </TabList>
        <TabPanel>
          {rideContents}
        </TabPanel>
        <TabPanel>
          {rideContents}
        </TabPanel>
      </Tabs>
    );
    return (
      <div className="Ride">
        <div>
          <nav className="navbar navbar-light bg-light">
            <div className="navbar-brand title" href="#">flock</div>
            <div className="dropdown">
              <AvatarMargin
                class="dropdown-toggle avatar"
                style={{ position: 'relative', marginTop: '20px' }}
                data-toggle="dropdown"
              >
                <span className="avatar">
                  <Avatar
                    class="avatar"
                    name={this.state.currentUser}
                    round
                    size={55}
                  />
                </span>
              </AvatarMargin>
              <div className="dropdown-menu dropdown-menu-right text-right" >
                <button
                  className="dropdown-item"
                  onClick={() => this.props.history.push(`/profile/${cookie.load('userId')}/info`)} // Profile.js
                  onKeyUp={() => {}}
                >My Profile
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => this.props.history.push(`/profile/${cookie.load('userId')}/offer`)} // Profile.js
                >My Offers
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => this.props.history.push(`/profile/${cookie.load('userId')}/request`)} // Profile.js
                >My Requests
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => this.props.history.push(`/profile/${cookie.load('userId')}/reserved_rides`)} // Profile.js
                >My Reserved Rides
                </button>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item"
                  key="Log Out"
                  onClick={this.handleLogout}
                  onKeyDown={() => {}}
                  style={{ color: '#cc3300', fontWeight: 'bold' }}
                >Log Out
                </button>
              </div>
            </div>
          </nav>
        </div>
        <Background>
          {FindOfferTabs}
        </Background>
      </div>
    );
  }
}

Ride.propTypes = {
  logoutSuccess: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired, // eslint-disable-line react/no-typos
};

export default Ride;

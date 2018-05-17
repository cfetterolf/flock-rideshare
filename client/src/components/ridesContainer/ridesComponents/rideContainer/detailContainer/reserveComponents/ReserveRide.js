/*
  Reserves a ride and emails the user who posted the ride

  props:
    ride: current ride
    rideUser: user who posted the selected ride

  called in:
    RideDetail.js
*/
import React from 'react';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import ReserveRideDetails from './ReserveRideDetails';


/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

const styles = {
  bg: {
    outline: 'none',
    background: '#eee url(https://subtlepatterns.com/patterns/extra_clean_paper.png)',
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
  },
  wrapper: {
    position: 'fixed',
    bottom: '0',
    width: '80%',
    height: '90%',
    boxShadow: '0 1px 10px rgba(0,0,0,0.24)',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    backgroundColor: 'white',
    padding: '0px 30px 20px 30px',
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    zIndex: '1000',
    margin: '-47px 0 10px 10px',
    display: 'flex',
    justifyContent: 'center',
  },
  scroll: {
    overflowY: 'scroll',
    position: 'fixed',
    height: '80%',
    width: '80%',
    bottom: '0px',
    padding: '30px',
  },
  back: {
    marginTop: '10px',
    fontSize: '18px',
    cursor: 'pointer',
    height: '40px',
  },
};

/*
 * props: match -- the object passed in by router
*/
export default class ReserveRide extends React.Component {
  constructor(props) {
    super(props);

    // Check if page was reloaded
    if (!this.props.location.state) {
      return; // redirect back in render
    }

    this.state = {
      // page: this.props.match.params.type,
      user: null,
      currentRide: props.location.state.detail,
      currentRideUser: props.location.state.rideUser,
    };
  }

  componentWillMount() {
    // TODO - fetch user's info from props.match.params.id
    fetch(`/api/users/${this.props.match.params.id}`, { headers: new Headers({ Accept: 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((data) => { // fetch user date of user logged in
        this.setState({ user: data });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  handleReserveRide(note) {
    const newRide = Object.assign({}, this.state.currentRide);
    delete newRide._id; // doesn't get ride from server if ._id is in object
    // changes the contents of object
    newRide.seats_avail -= 1;
    newRide.passengers.push(this.state.user._id);
    if (newRide.seats_avail === 0) { // in case the user took up the last seat
      newRide.fulfilled = true;
    }
    const site = 'https://secret-plains-24328.herokuapp.com/'; // TODO link to user profile
    const body = `<a href=${site}>${this.state.user.name}</a> has joined your ride. <br /> Notes from Passenger: ${note}`;
    this.updateRide(newRide);
    if (this.state.currentRideUser.phone && this.state.currentRideUser.phoneProvider) {
      const phone = `${this.state.currentRideUser.phone}`;
      const dest = phone + this.state.currentRideUser.phoneProvider;
      this.sendEmail(body, dest);
      return;
    }
    this.sendEmail(body, this.state.currentRideUser.email);
  }

  updateRide(newRide) {
    // PUT article, update the ride with id
    fetch(`/api/rides/${this.state.currentRide._id}`, {
      method: 'PUT',
      body: JSON.stringify(newRide),
      headers: new Headers({ 'Content-type': 'application/json' }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.status_text);
      }
      return response.json();
    }).then((updatedRide) => {
      this.setState({ currentRide: updatedRide });
    }).catch(err => console.log(err)); // eslint-disable-line no-console
  }

  sendEmail(body, dest) {
    const newBody = `Hi ${this.state.currentRideUser.name}, <br /><br />${body}<br /><br /> -FLOCK`;
    const email = {
      destination: dest,
      subject: 'FLOCK - Request Fulfilled',
      html: newBody,
    };
    fetch('/api/email/', {
      method: 'POST',
      body: JSON.stringify(email),
      headers: new Headers({ 'Content-type': 'application/json' }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.status_text);
      }
      return response.json();
    }).then(() => {
      window.alert('Seat Reserved and Email Sent!'); // eslint-disable-line no-alert
      this.props.history.goBack();
    }).catch(err => console.log(err)); // eslint-disable-line no-console
  }


  render() {
    // page was reloaded, so no props -> go back
    if (!this.props.location.state) {
      this.props.history.push('/');
      return null;
    }
    let body;
    let avatarHead;
    if (!this.state.user) {
      body = <div />;
    } else {
      body = (<ReserveRideDetails
        {...this.state.currentRideUser}
        {...this.state.currentRide}
        reserveRide={note => this.handleReserveRide(note)}
        history={this.props.history}
      />);
      avatarHead = (
        <div style={styles.avatar}>
          <Avatar name={this.state.user.name} round />
        </div>
      );
    }

    return (
      <div style={styles.bg}>
        <div style={styles.wrapper}>
          {avatarHead}
          <hr />
          <button
            type="button"
            className="btn btn-outline-primary"
            style={styles.back}
            onClick={() => this.props.history.push('/rides')}
          >
            Home
          </button>
          <div style={styles.scroll}>
            {body}
          </div>
        </div>
      </div>
    );
  }
}

ReserveRide.propTypes = {
  history: ReactRouterPropTypes.history.isRequired, // eslint-disable-line react/no-typos
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      detail: PropTypes.rideType, // eslint-disable-line react/no-typos
      rideUser: PropTypes.userType, // eslint-disable-line react/no-typos
    }).isRequired,
  }).isRequired,
};

ReserveRide.defaultProps = {};

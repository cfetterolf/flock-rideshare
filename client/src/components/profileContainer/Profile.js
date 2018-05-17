/*
  Profile component that:
    1. displays current user information of the user logged in
    2. allows user to update user information
    3. displays current offers and requests of user

  called in:
    Ride.js

*/
import React from 'react';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import ProfileInfo from './profileComponents/ProfileInfo';
import ProfileRides from './profileComponents/ProfileRides';

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
export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: this.props.match.params.type,
      rides: null,
      user: null,
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
      .then((data) => { // filter out rides that already expired
        this.setState({ user: data });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console


    // TODO - temp rides, when user has rides w/ profile replace
    fetch('/api/rides/', { headers: new Headers({ Accept: 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ rides: data });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

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

  updateUser(newUser) {
    this.setState({ user: newUser });
    window.alert('Profile changes successfully saved!'); // eslint-disable-line no-alert
  }

  render() {
    let body;
    let avatarHead;
    if (!this.state.user) {
      body = <div />;
    } else if (this.state.page === 'info' || !this.state.rides) {
      body = (<ProfileInfo
        {...this.props}
        user={this.state.user}
        updateUser={newUser => this.updateUser(newUser)}
      />);
      avatarHead = (
        <div style={styles.avatar}>
          <Avatar name={this.state.user.name} round />
        </div>
      );
    } else {
      body = (
        <ProfileRides
          rides={this.state.rides}
          type={this.props.match.params.type}
          user={this.props.match.params.id}
          deleteRide={(id) => { this.handleDeleteRide(id); }}
          cancelReservation={(newRide) => { this.handleCancelReservation(newRide); }}
        />
      );
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
            onClick={() => this.props.history.push('/rides')} // Ride.js

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

Profile.propTypes = {
  history: ReactRouterPropTypes.history.isRequired, // eslint-disable-line react/no-typos
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

Profile.defaultProps = {};

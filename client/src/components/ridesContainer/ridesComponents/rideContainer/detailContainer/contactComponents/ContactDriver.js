/*
  Allows a user to contact (by email) the user who posted the request/offer

  props:
      ride: selected ride
      rideUser: user of the selected ride

  called in:
      RideDetail.js
*/
import React from 'react';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import ContactDriverDetails from './ContactDriverDetails';


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
export default class ContactDriver extends React.Component {
  constructor(props) {
    super(props);
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
      .then((data) => { // filter out rides that already expired
        this.setState({ user: data });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  handleContactDriver(note) {
    const site = 'https://secret-plains-24328.herokuapp.com/'; // TODO link to user profile
    let body = `<a href=${site}>${this.state.user.name}</a> has sent you a message regarding your offer: <br /> ${note}`;
    if (this.state.currentRide.type === 'request') {
      body = `<a href=${site}>${this.state.user.name}</a> has sent you a message regarding your request: <br /> ${note}`;
    }
    this.sendEmail(body);
  }


  sendEmail(body) {
    const newBody = `Hi ${this.state.currentRideUser.name}, <br /><br />${body}<br /><br /> -FLOCK`;
    const email = {
      destination: this.state.currentRideUser.email,
      subject: 'FLOCK - Message From User',
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
      let alert = 'Your message was sent (without reserving the ride)!';
      if (this.state.currentRide.type === 'request') {
        alert = 'Your message was sent (without fulfilling the ride)!';
      }
      window.alert(alert); // eslint-disable-line no-alert

      // redirect back to rides
      this.props.history.goBack();
    }).catch(err => console.log(err)); // eslint-disable-line no-console
  }


  render() {
    let body;
    let avatarHead;
    if (!this.state.user) {
      body = <div />;
    } else {
      body = (<ContactDriverDetails
        {...this.state.currentRideUser}
        {...this.state.currentRide}
        contactDriver={note => this.handleContactDriver(note)}
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

ContactDriver.propTypes = {
  history: ReactRouterPropTypes.history.isRequired, // eslint-disable-line react/no-typos
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      detail: PropTypes.rideType, // eslint-disable-line react/no-typos
      rideUser: PropTypes.userType, // eslint-disable-line react/no-typos
    }).isRequired,
  }).isRequired,
};

ContactDriver.defaultProps = {};

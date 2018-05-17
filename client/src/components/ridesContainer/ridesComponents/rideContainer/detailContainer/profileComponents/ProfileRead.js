/*
  Profile component to display profile info of user currently logged in

  called in:
    RideDetail.js
*/
import React from 'react';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { userType, rideType } from '../../../../../../types';
import RideContainer from '../../RideContainer';

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
export default class ProfileRead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: this.props.match.params.type,
      allRides: null,
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

    fetch('/api/rides/', { headers: new Headers({ Accept: 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ allRides: data });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  render() {
    let body;
    let avatarHead;
    if (!this.state.user) {
      body = <div />;
    } else if (this.state.page === 'info' || !this.state.allRides) {
      body = (<ProfileInfo
        user={this.state.user}
        updateUser={newUser => this.setState({ user: newUser })}
      />);
      avatarHead = (
        <div style={styles.avatar}>
          <Avatar name={this.state.user.name} round />
        </div>
      );
    } else {
      body = (<ProfileRides rides={this.state.allRides} type={this.state.page} />);
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

ProfileRead.propTypes = {
  history: ReactRouterPropTypes.history.isRequired, // eslint-disable-line react/no-typos
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

ProfileRead.defaultProps = {};

function ProfileInfo(props) {
  const info = {
    Name: props.user.name,
    Phone: props.user.phone,
    Email: props.user.email,
    Car: props.user.car,
  };

  return (
    <div>
      <h3> {info.Name} </h3>
      {Object.keys(info).map(id => (
        <div className="form-group row" key={id}>
          {/* eslint-disable */}
        <label
          className="col-2 col-form-label"
          htmlFor={`user-${id}`}
        >
        {/* eslint-enable */}
          <strong>{id}</strong>
        </label>
          <div className="col-10">
            <input
              className="form-control"
              type="text"
              value={info[id]}
              id={`user-${id}`}
              readOnly
            />
          </div>
        </div>
    ), this)}
    </div>
  );
}

ProfileInfo.propTypes = {
  user: userType.isRequired,
};

function ProfileRides(props) {
  const listRides = props.allRides.map((ride) => {
    if (ride.type === props.type) {
      return (
        <RideContainer
          key={ride._id}
          {...ride}
        />
      );
    }
    return (<div key={ride._id} />);
  });

  const title = props.type === 'offer' ? 'My Offers' : 'My Requests';

  return (
    <div>
      <h3>{title}</h3>
      {listRides}
    </div>
  );
}

ProfileRides.propTypes = {
  allRides: PropTypes.arrayOf(rideType),
  type: PropTypes.string,
};

ProfileRides.defaultProps = {
  allRides: [],
  rides: [],
  type: 'request',
};

import React from 'react';
import cookie from 'react-cookies';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';


/* eslint-disable react/prefer-stateless-function */
import Ride from './components/Ride';
import Login from './components/Login';
import Profile from './components/profileContainer/Profile';
import ProfileRead from './components/ridesContainer/ridesComponents/rideContainer/detailContainer/profileComponents/ProfileRead';
import ReserveRide from './components/ridesContainer/ridesComponents/rideContainer/detailContainer/reserveComponents/ReserveRide';
import Request from './components/ridesContainer/requestComponents/Request';
import ContactDriver from './components/ridesContainer/ridesComponents/rideContainer/detailContainer/contactComponents/ContactDriver';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount() {
    if (cookie.load('userId')) {
      this.setState({ isLoggedIn: true });
    }
  }

  handleLogin(userId) {
    cookie.save('userId', userId, { path: '/' });
    this.setState({ isLoggedIn: true });
  }

  handleLogout() {
    cookie.remove('userId', { path: '/' });
    fetch('/logout', { headers: new Headers({ Accept: 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        this.setState({ isLoggedIn: false });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  render() {
    return (
      <HashRouter>
        <Switch>
          {/* Login Route */}
          <Route
            exact
            path="/"
            render={() => (
              this.state.isLoggedIn ? (
                <Redirect to="/rides" />
              ) : (
                <Login loginSuccess={this.handleLogin} />
              )
            )}
          />

          {/* Rides Route */}
          <Route
            path="/rides"
            render={props => (
              !this.state.isLoggedIn ? (
                <Redirect to="/" />
              ) : (
                <Ride {...props} logoutSuccess={this.handleLogout} />
              )
            )}
          />

          {/* Profile Route */}
          <Route
            path="/profile/:id/:type"
            render={props => (
              <Profile {...props} type="offer" />
            )}
          />

          {/* Profile Reader Route */}
          <Route
            path="/viewprofile/:id/:type"
            render={props => (
              <ProfileRead {...props} type="offer" />
            )}
          />

          {/* Reserve Ride  Route */}
          <Route
            path="/reserve/:id/"
            render={props => (
              <ReserveRide {...props} />
            )}
          />

          {/* Contact Driver  Route */}
          <Route
            path="/contact/:id/"
            render={props => (
              <ContactDriver {...props} />
            )}
          />

          {/* New Ride Route */}
          <Route
            path="/:edit/ride/:type/:id"
            render={props => (
              <Request {...props} />
            )}
          />

          {/* Reset Password Route */}
          <Route
            path="/reset/:token"
            render={props => (
              <Login {...props} />
          )}
          />

          {/* Default Route */}
          <Route path="/*" render={() => <Redirect to="/" />} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;

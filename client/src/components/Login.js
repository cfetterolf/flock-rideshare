/*
  component to handle:
      user log ins
      user log outs
      user registration
      password recovery
      password changes
*/

/* eslint-disable no-console,no-alert */
import React from 'react';
import PropTypes from 'prop-types';
import bgVid from '../img/vid2.mp4';
import '../css/Login.css';

/*
 * Props: loginClicked(): callback function when we want to change App.js isLoggedIn state
 */
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'login', email: '', password: '', name: '', passwordConf: '',
    };

    this.handleRegister = this.handleRegister.bind(this); // to get props in handleRegister
    this.handleLogin = this.handleLogin.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.changePass = this.changePass.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    if (this.props.match) {
      // eslint-disable-next-line react/prop-types
      console.log(this.props.match.params.token);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ mode: 'resetPass' });
    }
  }

  handleRegister(event) {
    const newUser = {
      email: this.state.email,
      name: this.state.name,
      password: this.state.password,
      passwordConf: this.state.passwordConf,
    };
    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
      headers: new Headers({ 'Content-type': 'application/json' }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.status_text);
      }
      return response.json();
    }).then((data) => {
      if (data.status_text.includes('User is not verified')) {
        this.setState({ mode: 'emailVerif' });
      }
    })
      .catch(err => console.log(err));
    event.preventDefault();
  }

  handleLogin(event) {
    const user = {
      email: this.state.email,
      password: this.state.password,
    };
    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: new Headers({ 'Content-type': 'application/json' }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.status_text);
      }
      return response.json();
    })
      .then((data) => {
        if (data.status_text) {
          if (data.status_text.includes('User is not verified')) {
            this.setState({ mode: 'emailVerif' });
          } else {
            alert(data.status_text);
          }
        }
        // eslint-disable-next-line no-underscore-dangle
        if (data._id) {
          // eslint-disable-next-line no-underscore-dangle
          this.props.loginSuccess(data._id);
        }
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
    event.preventDefault();
  }

  resetPassword(e) {
    e.preventDefault();
    console.log('been there');
    fetch('/api/forgotPass', {
      method: 'POST',
      body: JSON.stringify({ email: this.state.email }),
      headers: new Headers({ 'Content-type': 'application/json' }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.status_text);
      }
      return response.json();
    })
      .then((data) => {
        console.log(data);
        this.setState({ mode: 'emailVerif' });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  changePass(e) {
    e.preventDefault();
    console.log('change pass');
    const newPass = {
      password: this.state.password,
      passwordConf: this.state.passwordConf,
    };
    fetch(`/reset/${this.props.match.params.token}`, {
      method: 'POST',
      body: JSON.stringify(newPass),
      headers: new Headers({ 'Content-type': 'application/json' }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.status_text);
      }
      return response.json();
    })
      .then((data) => {
        // eslint-disable-next-line react/prop-types
        this.props.history.push('/');
        this.setState({ mode: 'login' });
        alert(data.msg);
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  render() {
    let form;
    let titles;
    if (this.state.mode === 'register') {
      titles = (
        <div>
          <h1 className="title">Flock</h1>
          <br />
        </div>
      );

      form = (
        <form className="form" onSubmit={this.handleRegister}>
          <input type="text" name="name" value={this.state.name} placeholder="Name" required minLength={2} onChange={event => this.setState({ name: event.target.value })} />
          <br />
          <input type="email" name="email" value={this.state.email} placeholder="Middlebury E-mail" required pattern="\b[A-Z0-9a-z._%+-]+@middlebury\.edu\b" onChange={event => this.setState({ email: event.target.value })} />
          <br />
          <input type="password" name="password" value={this.state.password} placeholder="Password" required minLength={4} onChange={event => this.setState({ password: event.target.value })} />
          <br />
          <input type="password" name="passwordConf" value={this.state.passwordConf} placeholder="Confirm Password" required minLength={4} onChange={event => this.setState({ passwordConf: event.target.value })} />
          <br />
          <input type="submit" className="btn-block btn-primary btn-register" value="Register" />
          <br />
          <div className="login-register">
            <p>Have an account?</p>
            <button className="btn btn-link" onClick={() => this.setState({ mode: 'login' })}>Login</button>
          </div>
          <br />
          <button className="btn btn-link" onClick={() => this.setState({ mode: 'passwordReset' })}>Forgot password?</button>
        </form>
      );
    } else if (this.state.mode === 'login') {
      titles = (
        <div>
          <h1 className="title">flock</h1>
          <br />
        </div>
      );

      form = (
        <form className="form" onSubmit={this.handleLogin}>
          <input type="email" name="logemail" value={this.state.email} placeholder="E-mail" required pattern="\b[A-Z0-9a-z._%+-]+@middlebury\.edu\b" onChange={event => this.setState({ email: event.target.value })} />
          <br />
          <input type="password" name="logpassword" value={this.state.password} placeholder="Password" required minLength={4} onChange={event => this.setState({ password: event.target.value })} />
          <br />
          <input type="submit" value="Log in" className="btn-block btn-primary" />
          <br />
          <div className="login-register">
            <p>New to flock?</p>
            <button className="btn btn-link" onClick={() => this.setState({ mode: 'register' })} >Register</button>
          </div>
          <br />
          <button className="btn btn-link" onClick={() => this.setState({ mode: 'passwordReset' })}>Forgot password?</button>
        </form>
      );
    } else if (this.state.mode === 'emailVerif') {
      titles = (
        <h4 className="center email-text">An email has been sent to {this.state.email}. <br />
               Check your inbox for a link to update your account!
        </h4>
      );
    } else if (this.state.mode === 'passwordReset') {
      form = (
        <form className="form" onSubmit={this.resetPassword}>
          <input type="email" name="logemail" value={this.state.email} placeholder="E-mail" required pattern="\b[A-Z0-9a-z._%+-]+@middlebury\.edu\b" onChange={event => this.setState({ email: event.target.value })} />
          <br />
          <input type="submit" value="Reset Password" className="btn-block btn-primary" />
          <br />
          <div className="login-register">
            <button className="btn btn-link" onClick={() => this.setState({ mode: 'login' })} >return to login page</button>
          </div>
          <br />
          <div className="login-register">
            <p>New to flock?</p>
            <button className="btn btn-link" onClick={() => this.setState({ mode: 'register' })} >register</button>
          </div>
        </form>
      );
    } else if (this.state.mode === 'resetPass') {
      form = (
        <form className="form" onSubmit={this.changePass}>
          <input type="password" name="password" id="password" placeholder="New password" value={this.state.password} onChange={event => this.setState({ password: event.target.value })} required minLength={4} />
          <br />
          <input type="password" name="confirm" id="confirm" placeholder="Confirm password" value={this.state.passwordConf} onChange={event => this.setState({ passwordConf: event.target.value })}required minLength={4} />
          <br />
          <input type="submit" value="Update Password" className="btn-block btn-primary" />
          <br />
          <div className="login-register">
            <button className="btn btn-link" onClick={() => this.setState({ mode: 'login' })} >return to login page</button>
          </div>
          <br />
          <div className="login-register">
            <p>New to flock?</p>
            <button className="btn btn-link" onClick={() => this.setState({ mode: 'register' })} >register</button>
          </div>
        </form>
      );
    }

    return (
      <div>
        <div id="vidContainer">
          <video autoPlay muted loop id="myVideo">
            <track kind="captions" />
            <source src={bgVid} type="video/mp4" />
          </video>
        </div>
        <div>
          <div className="bg">
            <div className="bd-form login-box">
              {titles}
              {form}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginSuccess: PropTypes.func.isRequired,
};

export default Login;

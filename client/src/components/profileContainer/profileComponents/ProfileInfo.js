/*
  Profile component that:
    1. displays current user information of the user logged in
    2. allows user to update user information
    3. displays current offers and requests of user

    called in:
      Profile.js
*/
import React from 'react';
import cookie from 'react-cookies';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import PropTypes from 'prop-types';
import { userType } from '../../../types';

/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

let disableInputs = false;

class ProfileInfo extends React.Component {
  constructor(props) {
    super(props);

    if (props.match.params.id !== cookie.load('userId')) {
      disableInputs = true;
    }

    this.state = {
      fields: {
        Name: props.user.name,
        Phone: props.user.phone,
        Email: props.user.email,
        Car: props.user.car,
      },
      PhoneProvider: props.user.phoneProvider,
      infoChanged: false,
    };

    this.saveUserInfo = this.saveUserInfo.bind(this);
    this.handleInfoUpdate = this.handleInfoUpdate.bind(this);
  }

  saveUserInfo() {
    const phone = this.validatePhoneNumber(this.state.fields.Phone);
    if (phone || !this.state.fields.Phone) { // if the phone is valid
      const user = {
        name: this.state.fields.Name,
        email: this.state.fields.Email,
        car: this.state.fields.Car,
        phone: parseInt(phone.replace(/\-/g, ''), 10), // eslint-disable-line no-useless-escape
        phoneProvider: this.state.PhoneProvider,
      };

      fetch(`/api/users/${this.props.user._id}`, {
        method: 'PUT',
        body: JSON.stringify(user),
        credentials: 'include',
        headers: new Headers({ 'Content-type': 'application/json' }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      }).then((updatedUser) => {
        this.setState({ infoChanged: false });
        this.props.updateUser(updatedUser);
      }).catch(err => console.log(err)); // eslint-disable-line no-console
    } else {
      window.alert('Alert: Enter a valid US phone number'); // eslint-disable-line no-alert
    }
  }

  handleInfoUpdate(field, event) {
    const fields = this.state.fields; // eslint-disable-line prefer-destructuring
    fields[field] = event.target.value;
    this.setState({ fields, infoChanged: true });
  }

  validatePhoneNumber(phoneNumber) { // eslint-disable-line class-methods-use-this
    // Phone number validation using google-libphonenumber, ruturns the valid phone number
    let phone;
    try {
      const phoneUtil = PhoneNumberUtil.getInstance();
      if (phoneUtil.isValidNumber(phoneUtil.parse(`${phoneNumber}`, 'US'))) {
        phone = phoneUtil.format(phoneUtil.parse(`${phoneNumber}`, 'US'), PhoneNumberFormat.US);
      }
    } catch (e) {
      phone = '';
    }
    return phone;
  }

  render() {
    return (
      <div>
        <form>
          {Object.keys(this.state.fields).map((key) => {
            // Make Email field read-only
            const readOnly = (key === 'Email') || disableInputs;
            const input = (
              <input
                className="form-control"
                type="text"
                value={this.state.fields[key]}
                onChange={e => this.handleInfoUpdate(key, e)}
                id={`user-${key}`}
                readOnly={readOnly}
              />
            );

            return (
              <div className="form-group row" key={key}>
                <label className="col-2 col-form-label" htmlFor={`user-${key}`}>
                  <strong>{key}</strong>
                </label>
                <div className="col-10">
                  {input}
                </div>
              </div>
            );
          })}
          <div className="form-group row">
            <label className="col-2 col-form-label" htmlFor="provider">
              <strong>Cellphone Provider</strong>
            </label>
            <div className="col-10">
              <select value={this.state.PhoneProvider} onChange={event => this.setState({ PhoneProvider: event.target.value, infoChanged: true })} id="provider">
                <option value="">Other</option>
                <option value="@txt.att.net">AT&T</option>
                <option value="@tmomail.net">T-Mobile</option>
                <option value="@messaging.sprintpcs.com">Sprint</option>
                <option value="@vtext.com">Verizon</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <div className="offset-sm-2 col-sm-10">
              <input
                type="button"
                value="Save"
                className="btn btn-success"
                onClick={this.saveUserInfo}
                disabled={!this.state.infoChanged || disableInputs}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

ProfileInfo.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  user: userType.isRequired,
  updateUser: PropTypes.func.isRequired,
};

export default ProfileInfo;

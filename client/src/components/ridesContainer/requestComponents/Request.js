/*
Allows user to request/post a new ride or to fulfill an existing request

called in:
    RideDetail.js
    RideTableContainer.js
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import styled from 'styled-components';
import cookie from 'react-cookies';
import MapSearchBar from '../mapComponents/MapSearchBar';
import UberPrice from './UberPrice';
import '../../../css/Login.css';

const Background = styled.div`
background: #eee url(https://subtlepatterns.com/patterns/extra_clean_paper.png);
width: 100%;
height: 100%;
display: grid;
padding: 20px;
`;
const Address = styled.p`
text-indent: 20px;
font-weight: bold;
`;

class Request extends Component { /* eslint-disable-line react/no-multi-comp */
  constructor(props) {
    super(props);

    this.state = {
      type: props.match.params.type,
      from: '',
      fromgeo: '',
      to: '',
      togeo: '',
      time: '',
      date: '',
      passengers: [], // passengers: null or array of studentID
      seats_avail: 1,
      notes: '',
      price: '',
      user: cookie.load('userId'),
      rideUserID: null,
      rideUser: null,
    };

    // This binding is necessary to make `this` work in the callback, without
    // creating a new callback in each render
    // https://reactjs.org/docs/handling-events.html
    this.handleSave = this.handleSave.bind(this);
    this.handleFrom = this.handleTextUpdate.bind(this, 'from');
    this.handleTo = this.handleTextUpdate.bind(this, 'to');
    this.handleTime = this.handleTextUpdate.bind(this, 'time');
    this.handleDate = this.handleTextUpdate.bind(this, 'date');
    this.handleAvailSeats = this.handleTextUpdate.bind(this, 'seats_avail');
    this.handleNotes = this.handleTextUpdate.bind(this, 'notes');
    this.handlePrice = this.handleTextUpdate.bind(this, 'price');
    this.updateRide = this.updateRide.bind(this);
  }

  componentWillMount() {
    // fetch rides info from props.match.params.id
    fetch(`/api/rides/${this.props.match.params.id}`, { headers: new Headers({ Accept: 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((data) => {
        if (data.from) {
          this.setState({
            from: data.from,
            fromgeo: data.fromgeo,
            to: data.to,
            togeo: data.togeo,
            time: data.time,
            date: data.date,
            passengers: [],
            seats_avail: data.seats_avail,
            notes: data.notes,
            price: data.price,
            rideUserID: data.user,
          });
          // fetch user info of ride owner in order to send emails
          fetch(`/api/users/${data.user}`, { headers: new Headers({ Accept: 'application/json' }) })
            .then((response) => {
              if (!response.ok) {
                throw new Error(response.status_text);
              }
              return response.json();
            })
            .then((data1) => {
              this.setState({ rideUser: data1 });
            })
            .catch(err => console.log(err)); // eslint-disable-line no-console
        }
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  handleTextUpdate(field, event) {
    this.setState({ [field]: event.target.value });
  }

  handleSave() {
    let t = this.state.time; // check if time was entered
    if (t === '') {
      t = 'any';
    }

    // creates new ride object based on changed states
    const newRide = {
      type: this.state.type,
      studentID: '',
      fulfilled: false,
      from: this.state.from,
      fromgeo: this.state.fromgeo,
      to: this.state.to,
      togeo: this.state.togeo,
      time: this.state.time,
      date: this.state.date,
      passengers: this.state.passengers,
      seats_avail: Number(this.state.seats_avail),
      notes: this.state.notes,
      price: Number(this.state.price),
      user: this.state.user,
    };

    const now = new Date();
    const dateString = `${newRide.date}T${newRide.time}:00`;
    let date = new Date(dateString);
    date = isNaN(date.getTime()) ? new Date(newRide.date) : date; // eslint-disable-line no-restricted-globals, max-len
    if (date < now) {
      alert('Alert: Please enter a non-expired date.'); // eslint-disable-line no-alert
    } else if (!newRide.from) {
      alert('Alert: Please enter an origin location.'); // eslint-disable-line no-alert
    } else if (!newRide.to) {
      alert('Alert: Please enter a destination location.'); // eslint-disable-line no-alert
    } else if (!newRide.date) {
      alert('Alert: Please enter a date.'); // eslint-disable-line no-alert
    } else if (this.props.match.params.edit === 'edit') {
      this.updateRide(newRide);
    } else {
      this.handleNewRide(newRide);
    }
  }


  updateRide(newRide) {
    // PUT article, update the ride with id
    fetch(`/api/rides/${this.props.match.params.id}`, { // eslint-disable-line no-underscore-dangle
      method: 'PUT',
      body: JSON.stringify(newRide),
      headers: new Headers({ 'Content-type': 'application/json' }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.status_text);
      }
      return response.json();
    }).then(() => {
      this.props.history.push('/rides');
    }).catch(err => console.log(err)); // eslint-disable-line no-console
  }


  // if user posts a new ride
  handleNewRide(newRide) {
    fetch('/api/rides/', {
      method: 'POST',
      body: JSON.stringify(newRide),
      headers: new Headers({ 'Content-type': 'application/json' }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.status_text);
      }
      return response.json();
    }).then(() => { // update state's collection
      if (this.state.rideUser) {
        const site = 'https://secret-plains-24328.herokuapp.com/';// TODO link to reserve ride page
        const body = `Someone posted a similar ride to one of your requests! <br/> Link: <a href=${site}> ${site}</a>`;
        if (this.state.rideUser.phone && this.state.rideUser.phoneProvider) { // eslint-disable-line max-len
          const phone = `${this.state.rideUser.phone}`;
          const dest = phone + this.state.rideUser.phoneProvider;
          this.sendEmail(body, dest);
        }
        this.sendEmail(body, this.state.rideUser.email);
      }
      this.props.history.push('/rides');
    }).catch(err => console.log(err)); // eslint-disable-line no-console
  }

  sendEmail(body, dest) {
    const newBody = `Hi ${this.state.rideUser.name}, <br /><br />${body}<br /><br /> -FLOCK`;
    const email = {
      destination: dest,
      subject: 'FLOCK - Matching Ride',
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
    }).catch(err => console.log(err)); // eslint-disable-line no-console
  }

  render() {
    let from;
    let to;
    if (this.state.rideUserID) {
      // static addresses when fulfilling an exisiting request
      from = (
        <div>
          <label htmlFor="from">
            From: <Address>{this.state.from}</Address>
          </label>
        </div>);
      to = (
        <div>
          <label htmlFor="to">
            To: <Address>{this.state.to}</Address>
          </label>
        </div>);
    } else {
      from = (
        <div>
          <label htmlFor="from">
            From:
            <MapSearchBar
              selected={addr => this.setState({ from: addr })}
              geoSelected={geo => this.setState({ fromgeo: geo })}
              displayText="Search for a location"
            />
          </label>
        </div>);
      to = (
        <div>
          <label htmlFor="to">
            To:
            <MapSearchBar
              selected={addr => this.setState({ to: addr })}
              geoSelected={geo => this.setState({ togeo: geo })}
              displayText="Search for a location"
            />
          </label>
        </div>);
    }

    // input type="time" is not supported on safari
    const time = (
      <div>
        <label htmlFor="time">
      Enter the Time:
          <input
            id="time"
            type="time"
            value={this.state.time}
            onChange={this.handleTime}
          />
        </label>
      </div>);

    // input type="date" is not supported on safari
    const date = (
      <div>
        <label htmlFor="date">
          Enter the Date:
          <input
            id="date"
            type="date"
            value={this.state.date}
            placeholder="mm/dd/yy"
            required
            pattern="[0-9]{2}/[0-9]{2}/[0-9]{2}"
            onChange={this.handleDate}
          />
        </label>
      </div>
    );

    const availSeats = (
      <div>
        <label htmlFor="seats">
          Number of Seats Available/Wanted:
          <input
            id="seats"
            type="number"
            min="1"
            value={this.state.seats_avail}
            onChange={this.handleAvailSeats}
          />
        </label>
      </div>);

    const notes = (<textarea
      cols="100"
      rows="10"
      value={this.state.notes}
      placeholder="Notes"
      onChange={this.handleNotes}
    />);

    const uber = this.state.togeo && this.state.fromgeo ? (
      <UberPrice fromgeo={this.state.fromgeo} togeo={this.state.togeo} />
    ) : <div />;

    const price = (
      <div>
        <label htmlFor="price">
        Price:
          <input
            className="offset-sm-2"
            id="price"
            type="number"
            min="0"
            value={this.state.price}
            placeholder="Price"
            onChange={this.handlePrice}
          />
        </label>
        {uber}
      </div>
    );

    return (
      <div className="Ride">
        <div>
          <nav className="navbar navbar-light bg-light">
            <li className="navbar-brand title" href="#">flock</li>
          </nav>
        </div>
        <Background>
          <div className="footer">
            {from}
            {to}
            {time}
            {date}
            {availSeats}
            {notes}
            {price}
            <br />
            <br />
            <div className="footer">
              <input className="footerbutton" type="button" disabled={this.state.date === '' || this.state.from === '' || this.state.to === '' || this.state.seats_avail === 0} onClick={this.handleSave} value="Save" />
              <input className="footerbutton" type="button" onClick={() => this.props.history.push('/rides')} value="Cancel" />
            </div>
          </div>
        </Background>
      </div>
    );
  }
}

Request.propTypes = {
  history: ReactRouterPropTypes.history.isRequired, // eslint-disable-line react/no-typos
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      edit: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,

};


export default Request;

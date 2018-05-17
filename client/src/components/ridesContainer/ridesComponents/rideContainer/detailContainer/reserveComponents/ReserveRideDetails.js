/*
  details for confirmation page for reservation of a ride

  props:
    all props of currentRideUser (user who posted the ride)
    all props of currentRide (ride currently selected)
    reserveRide: callback to reserve currently selected ride and send a note to user who posted it
    history: callback to toggle between pages

  called in:
    ReserveRide.js
*/

/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import styled from 'styled-components';
import Avatar from 'react-avatar';


const Detail = styled.div`
margin: 5px 1em;
border: 1px solid #DDDDDD;
padding: 10px;
clear: both;
background: white;
`;

const RightColumn = styled.div`
float: left;
width: 60%
`;

const LeftColumn = styled.div`
float: left;
width: 200px;
text-align: center;
`;

const Description = styled.div`
font-family: 'IBM Plex Sans', sans-serif;
`;


const Clear = styled.div`
clear: both;
`;


const Subtitle = styled.p`
font-weight:bold;
display: inline;
`;

const Summary = styled.div`
margin: 20px;
`;

const Title = styled.p`
font-family: 'IBM Plex Sans', sans-serif;
font-weight:bold;
margin:0px;
`;

const Date = styled.p`
font-family: 'IBM Plex Sans', sans-serif;
margin: 0px;
padding-left: 1em;
`;

const SeatsAvailable = styled.p`
margin:0px;
padding-left: 1em;
font-size:smaller;
`;

class ReserveRideDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteToUser: '',
    };
    this.handleNotes = this.handleTextUpdate.bind(this, 'noteToUser');
  }

  handleTextUpdate(field, event) {
    this.setState({ [field]: event.target.value });
  }
  render() {
    let v = 'Click to Confirm your Ride!';
    if (this.props.type === 'request') {
      v = 'Click to Fulfill Request!';
    }

    const confirmButton = (<input
      type="button"
      value={v}
      onClick={() => { this.props.reserveRide(this.state.noteToUser); this.setState({ noteToUser: '' }); }}
    />);

    const cancelButton = (<input
      type="button"
      value="Cancel"
      onClick={() => this.props.history.push('/rides')}
    />);

    // message to be sent to user who created request/offer
    const notes = (<textarea
      cols="50"
      rows="10"
      value={this.state.noteToUser}
      placeholder="Message to User"
      onChange={this.handleNotes}
    />);

    let seatDisplay = 'Seats Needed';
    if (this.props.type === 'offer') {
      seatDisplay = 'Seats Available';
    }

    return (
      <Detail >
        <LeftColumn>
          <br />
          <Avatar
            name={this.props.name}
            round
  //          onClick={() => this.props.history.push('/profile/12123/offer')}
          />
          <Description> {this.props.name} </Description>
        </LeftColumn>
        <RightColumn>
          <Summary>

            <Title >{`${this.props.from} to ${this.props.to}`}</Title>
            <Date>({this.props.date})</Date>
            <SeatsAvailable> {seatDisplay}: {this.props.seats_avail}</SeatsAvailable>
          </Summary>
          <hr />
          <Description>
            <Subtitle>
              Time of Departure:
            </Subtitle> {this.props.time}
          </Description>
          <Description>
            <Subtitle>
              Price:
            </Subtitle> ${this.props.price}
          </Description>
          <Description>
            <Subtitle>
              Notes:
            </Subtitle> {this.props.notes}
          </Description>
          {notes}
          {confirmButton}
          {cancelButton}

        </RightColumn>
        <Clear />
      </Detail>
    );
  }
}


export default ReserveRideDetails;

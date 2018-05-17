/*
  displays details of the ride and a textbox to message a user

  props:
    all props of currentRideUser
    all props of currentRide
    contactDriver: callback that passes back the message
    history: toggle between pages

  called in:
    ContactDriver.js
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

const Description = styled.p`
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

class ContactDriverDetails extends Component {
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
    let buttonValue = 'Click Message the Driver!';
    let placeHolder = 'Message to Driver (This does not reserve the ride)';
    if (this.props.type === 'request') {
      buttonValue = 'Click to Message the Passenger!';
      placeHolder = 'Message to Passenger (This does not fulfill the ride)';
    }

    const confirmButton = (<input
      type="button"
      value={buttonValue}
      // add functionality of button
      onClick={() => { this.props.contactDriver(this.state.noteToUser); this.setState({ noteToUser: '' }); }}
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
      placeholder={placeHolder}
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


export default ContactDriverDetails;

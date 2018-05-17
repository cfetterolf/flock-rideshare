import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Suggestion = styled.div`
display: inline-block !important;
margin-left: 10px;
`;

/*
 * props:
 *    fromgeo: location object
 *    togeo: location object
 */
class UberPrice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      price: null,
      togeo: this.props.togeo,
      fromgeo: this.props.fromgeo,
    };

    this.getUberPrice = this.getUberPrice.bind(this);
  }

  componentWillMount() {
    this.getUberPrice();
  }

  componentWillReceiveProps(nextProps) {
    // new props!  compute price again
    if (this.props.fromgeo !== nextProps.fromgeo
      || this.props.togeo !== nextProps.togeo) {
      this.setState({
        price: null,
        togeo: nextProps.togeo,
        fromgeo: nextProps.fromgeo,
      }, () => this.getUberPrice());
    }
  }

  getUberPrice() {
    const { lat: fromLat, lng: fromLng } = this.state.fromgeo;
    const { lat: toLat, lng: toLng } = this.state.togeo;

    if (fromLat && fromLng && toLat && toLng) {
      const newDestination = {
        fromLat,
        fromLng,
        toLat,
        toLng,
      };

      fetch(
        '/api/uber',
        {
          method: 'POST',
          body: JSON.stringify(newDestination),
          headers: new Headers({
            'Content-type': 'application/json',
          }),
        },
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.status_text);
          }
          return response.json();
        })
        .then((uber) => {
          // Endpoints are too far apart
          if (uber.code === 'distance_exceeded') {
            this.setState({
              price: null,
            });
            return;
          }
          this.setState({ price: null });
          const uberX = uber.prices.filter(index => index.localized_display_name === 'uberX');
          if (uberX.length >= 1) {
            const compensation = uberX[0].estimate;
            this.setState({ price: compensation });
          }
        })
        .catch((err) => { console.error(err); }); // eslint-disable-line no-console
    }
  }

  render() {
    let msg = 'Uber\'s Suggested Compensation Range:';
    if (this.state.price === null) {
      msg = '';
    }

    return (
      <Suggestion>
        {msg}
        <strong style={{ marginLeft: '5px' }}>
          {this.state.price}
        </strong>
      </Suggestion>
    );
  }
}

UberPrice.propTypes = {
  fromgeo: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  togeo: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
};

UberPrice.defaultProps = {
  fromgeo: {},
  togeo: {},
};

export default UberPrice;

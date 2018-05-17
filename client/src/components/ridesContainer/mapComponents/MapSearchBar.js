/*
Source: https://github.com/kenny-hibino/react-places-autocomplete/blob/master/demo/components/SearchBar.js

Component implementing Google API place-autocomplete, to create a search bar
that upon input, queries for recommended addresses/locations. These addresses
are displayed to the user in a dropdown where they can be selected. They
contain geotags so that lat and lng can be recorded with them.

props:
    searchedLocation: callback to update state in RideTableContainer to be used in MapContainer
                      to display a waypoint on map
    geoSelected:      callback to set state in Request.js so that accurate lat/lng added to requests
    selected:         callback to set state in Request.js so that accurate address added to requests
    displayText:      text to fill the search bar with

called in:
    RideTableContainer.js
    Request.js
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import '../../../css/MapSearchBar.css';

/* eslint-disable react/prop-types */
const renderSuggestion = ({ formattedSuggestion }) => (
  <div className="Suggestion-item">
    <i className="fa fa-map-marker Suggestion-icon" />
    <strong>{formattedSuggestion.mainText}</strong>{' '}
    <small className="text-muted">{formattedSuggestion.secondaryText}</small>
  </div>
);
/* eslint-enable react/prop-types */

const cssClasses = {
  root: 'form-group',
  input: 'Search-input',
  autocompleteContainer: 'Autocomplete-container',
};

// get suggestions after more than 2 characters have been entered
const shouldFetchSuggestions = ({ value }) => value.length > 2;


const onError = (status, clearSuggestions) => {
  /* eslint-disable no-console */
  console.log(
    'Error happened while fetching suggestions from Google Maps API',
    status,
  );
  /* eslint-enable no-console */
  clearSuggestions();
};


class MapSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSelect(inputAddress) {
    this.setState({
      address: inputAddress,
    });

    if (this.props.selected) {
      this.props.selected(inputAddress);
    }

    geocodeByAddress(inputAddress)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        if (this.props.geoSelected) {
          this.props.geoSelected({ lat, lng });
        }
        if (this.props.searchedLocation) {
          this.props.searchedLocation({ lat, lng });
        }
      })
      .catch((error) => {
        console.log('Geocode Error', error); // eslint-disable-line no-console
      });
  }

  // handles change in input text for search bar
  handleChange(input) {
    if (!input && this.props.searchedLocation) {
      this.props.searchedLocation(null);
      // set state in RideTableContainer to null to remove waypoints
    }

    this.setState({
      address: input,
    });
  }

  render() {
    const inputProps = {
      type: 'text',
      value: this.state.address,
      onChange: this.handleChange,
      autoFocus: true,
      placeholder: this.props.displayText,
      name: 'Demo__input',
      id: 'my-input-id',
    };

    return (
      <div>
        <PlacesAutocomplete
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          classNames={cssClasses}
          onSelect={this.handleSelect}
          onEnterKeyDown={this.handleSelect}
          onError={onError}
          shouldFetchSuggestions={shouldFetchSuggestions}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

MapSearchBar.propTypes = {
  geoSelected: PropTypes.func,
  selected: PropTypes.func,
  searchedLocation: PropTypes.func,
  displayText: PropTypes.string,
};

MapSearchBar.defaultProps = {
  geoSelected: () => {},
  selected: () => {},
  searchedLocation: () => {},
  displayText: 'Enter a location',
};

export default MapSearchBar;

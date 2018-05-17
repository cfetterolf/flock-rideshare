/*
filters rides based on user selection
    1. filters by a search term (ie, "Boston," "Middlebury")
    2. filters by ride type (search only offers or only requests or seach both)
    3. sort rides based on origins, destinations or date
    4. filter rides based on a range of date

props:
    searchTerm: the search term user types in the search bar
    setTerm: callback to update the searchTerm
    sortType: term by which to sort the rides (destination, origin or date)
    searchType: user selection of ride types to be search (offers, requests or both)
    setType: callback to update the sortType
    setSearchType: callback to update the searchType
    setStartDate: callback to set the starting date from which to filter rides
    setEndDate: callback to set the ending date to which filter rides to

called in:
    RideTableContainer.js
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import '../../../css/Login.css';

const SearchMargin = styled.div`
width: 100%;
float: left;
margin-bottom: 5px;
margin-top: -5px;
`;
const Clarify = styled.p`
margin: 5px 15px;
float: left;
display: inlineblock;
`;

const Bar = styled.div`
width: 100%;
float:left;
display: block;
position:relative;
`;

const SearchInput = styled.input`
  border-radius: 0;
  border-top-style: none;
  border-left-style: none;
  border-right-style: none;
  width: 225px;
  margin-top: 10px;
  margin-bottom: 0px;
  &:focus {
    border-color: grey;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
`;

const LinkButton = styled.div`
  background:'none';
  border: none;
  cursor: pointer;
  margin-top: 8px;
  float: right;
  text-decoration:underline;

`;

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      advanced: false,
    };
  }

  // handles the clicks for the check boxes selecting origins/destinations
  handleBox(newType) {
    const currentType = this.props.searchType;
    if (currentType === '') {
      this.props.setSearchType(newType);
    } else if (currentType === 'both') {
      // eslint-disable-next-line no-unused-expressions
      newType === 'to' ? this.props.setSearchType('from') : this.props.setSearchType('to');
    } else { // eslint-disable-next-line no-unused-expressions
      currentType === newType ? this.props.setSearchType('') : this.props.setSearchType('both');
    }
  }

  render() {
    const searchFieldAdvanced = (
      <div>
        <SearchInput
          type="text"
          className="form-control"
          placeholder="Search Rides..."
          value={this.props.searchTerm}
          onChange={(event) => { this.props.setTerm(event.target.value); }}
        />
      </div>
    );

    const searchField = (
      <div>
        <SearchInput
          type="text"
          className="form-control"
          placeholder="Search Rides..."
          value={this.props.searchTerm}
          onChange={(event) => { this.props.setTerm(event.target.value); }}
        />
      </div>
    );


    const sortTool = (
      <div className="form-row">
        <div className="form-col-6">
          <input
            style={{ marginTop: '15px' }}
            type="checkbox"
            id="origin"
            checked={this.props.searchType === 'from' || this.props.searchType === 'both'}
            onChange={() => { this.handleBox('from'); }}
          />Origins&nbsp;&nbsp;
          <input
            type="checkbox"
            id="destination"
            checked={this.props.searchType === 'to' || this.props.searchType === 'both'}
            onChange={() => { this.handleBox('to'); }}
          />Destinations
        </div>
        <div className="form-col-6" style={{ paddingTop: '5px' }}>
          <Clarify> Sort Rides by: </Clarify>
          <select
            value={this.props.sortType}
            onChange={(event) => { this.props.setType(event.target.value); }}
          >
            <option value="from">Origin</option>
            <option value="to">Destination</option>
            <option value="date">Date</option>
          </select>
        </div>
      </div>
    );

    const dateRange = (
      <div>
        <Clarify>
          <label htmlFor="fromDate">
        Specify Date Range:&nbsp;&nbsp;
            <input
              type="date"
              value={this.props.startDate || undefined}
              placeholder="mm/dd/yy"
              required
              pattern="[0-9]{2}/[0-9]{2}/[0-9]{2}"
              onChange={(event) => { this.props.setStartDate(event.target.value); }}
            />
          </label>
          { } to { }
          <label htmlFor="toDate">
            <input
              type="date"
              value={this.props.endDate || undefined}
              placeholder="mm/dd/yy"
              required
              pattern="[0-9]{2}/[0-9]{2}/[0-9]{2}"
              onChange={(event) => { this.props.setEndDate(event.target.value); }}
            />
          </label>
        </Clarify>
      </div>
    );


    const fields = (
      <form style={{ height: '10%' }} >
        <div className="form-row">
          <div className="col">
            <SearchMargin>{searchField}</SearchMargin>
          </div>
          <div className="col">
            <LinkButton onClick={() => this.setState({ advanced: !this.state.advanced })}>
            Advanced Options
            </LinkButton>
          </div>
        </div>
      </form>
    );

    const fieldsAdvanced = (
      <form>
        <div className="form-row">
          <div className="col">
            <SearchMargin>{searchFieldAdvanced}</SearchMargin>
          </div>
          <div >
            <LinkButton onClick={() => this.setState({ advanced: !this.state.advanced })}>
            Fewer Options
            </LinkButton>
          </div>
        </div>
        <div float="left">
          {sortTool}
        </div>
        <div className="form-row" float="left">
          {dateRange}

        </div>

      </form>
    );

    let content;
    if (this.state.advanced) {
      content = fieldsAdvanced;
    } else {
      content = fields;
    }


    return (
      <Bar>
        {content}
      </Bar>
    );
  }
}

SearchBox.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  sortType: PropTypes.string.isRequired,
  setTerm: PropTypes.func.isRequired,
  setType: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
  setSearchType: PropTypes.func.isRequired,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  setStartDate: PropTypes.func.isRequired,
  setEndDate: PropTypes.func.isRequired,
};

SearchBox.defaultProps = {
  startDate: null,
  endDate: null,
};


export default SearchBox;

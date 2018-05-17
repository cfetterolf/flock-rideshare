import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import createHistory from 'history/createMemoryHistory';
import MapSearchBar from './mapComponents/MapSearchBar';
import MapContainer from './mapComponents/MapContainer';
import RideTableContainer from './RideTableContainer';

configure({ adapter: new Adapter() });
const rides = [
  {
    id: '5ae47ca1fa6c040014ce36b9',
    type: 'offer',
    studentID: '',
    fulfilled: false,
    from: 'Boston Post Road, Milford, CT, USA',
    fromgeo: { lat: 41.243101, lng: -73.03058929999997 },
    to: 'Greensboro, NC, USA',
    togeo: { lat: 36.0726354, lng: -79.79197540000001 },
    time: '00:12',
    date: '2018-04-28',
    passengers: [],
    seats_avail: 4,
    notes: '',
    price: 0,
  },
];


describe('Updating map based ride actions', () => {
  test('Initially map has no route', () => {
    const comp = shallow(<RideTableContainer
      rides={rides}
      deleteRide={jest.fn}
      type="offer"
      history={createHistory()}
    />, { disableLifecycleMethods: true });

    const map = comp.find(MapContainer);
    expect(map.exists()).toBe(true);
    expect(map.props()).toMatchObject({
      currentToGeo: null,
      currentFromGeo: null,
      searchedLocation: null,
    });
  });
});

describe('Map search interaction', () => {
  test('Search bar updates Map props when intermediate point is selected', () => {
    const comp = shallow(<RideTableContainer
      rides={rides}
      deleteRide={jest.fn}
      type="offer"
      history={createHistory()}
    />, { disableLifecycleMethods: true });
    expect(comp.exists()).toBe(true);

    const searchBar = comp.find(MapSearchBar);
    expect(searchBar.exists()).toBe(true);
    searchBar.prop('searchedLocation')({ lat: 41.0, lng: -73.0 });

    comp.update(); // Force re-render

    const map = comp.find(MapContainer);
    expect(map.exists()).toBe(true);
    expect(map.prop('searchedLocation')).toEqual({ lat: 41.0, lng: -73.0 });
  });
});


describe('RideTableContainer', () => {
  test('Initializes sortType to be "to"', () => {
    const comp = shallow(<RideTableContainer
      rides={rides}
      type="offer"
      deleteRide={jest.fn}
      history={createHistory()}
    />, { disableLifecycleMethods: true });
    expect(comp.state('sortType')).toBe('to');
  });

  test('Map shows no waypoint when SearchBar is empty', () => {
    const comp = shallow(<RideTableContainer
      rides={rides}
      type="offer"
      deleteRide={jest.fn}
      history={createHistory()}
    />, { disableLifecycleMethods: true });
    comp.setState({
      currentFromGeo: {
        lat: 44.00825950000001,
        lng: -73.17731520000001,
      },
      currentToGeo: {
        lat: 42.3355488,
        lng: -71.16849450000001,
      },
      searchedLocation: null,
    });

    // make sure searchBar is empty
    const mapSearchBar = comp.find(MapSearchBar).shallow();
    expect(mapSearchBar.exists()).toBe(true);
    expect(mapSearchBar.state('address')).toBe('');

    // make sure map has no waypoint given to it
    const mapContainer = comp.find(MapContainer);
    expect(mapContainer.exists()).toBe(true);
    expect(mapContainer.at(0).prop('searchedLocation')).toBe(null);
  });
});

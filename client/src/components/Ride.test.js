import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import createHistory from 'history/createMemoryHistory';
import RideTableContainer from './ridesContainer/RideTableContainer';
import Ride from './Ride';

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
  {
    id: '5ee66ca6fa6c040014ce36c8',
    type: 'request',
    studentID: '',
    fulfilled: false,
    from: 'ADK',
    fromgeo: { lat: 41.243101, lng: -73.03058929999997 },
    to: 'Sabai',
    togeo: { lat: 36.0726354, lng: -79.79197540000001 },
    time: '00:12',
    date: '2018-04-28',
    passengers: [],
    seats_avail: 2,
    notes: '',
    price: 0,
  },
  {
    id: '1aa44357pp6c040014ce36c8',
    type: 'request',
    studentID: '',
    fulfilled: false,
    from: 'Gym',
    fromgeo: { lat: 41.243101, lng: -73.03058929999997 },
    to: 'New York',
    togeo: { lat: 36.0726354, lng: -79.79197540000001 },
    time: '00:12',
    date: '2018-04-28',
    passengers: [],
    seats_avail: 2,
    notes: '',
    price: 0,
  },
];
describe('Ride', () => {
  test('Initializes state to request tab', () => {
    const comp = shallow(<Ride
      // rides={rides}
      logoutSuccess={jest.fn}
      history={createHistory()}
    />, { disableLifecycleMethods: true });
    expect(comp.state('tab')).toBe('request');
  });
  test('Request tab only shows request ride(s)', () => {
    const comp = shallow(<Ride
      rides={rides}
      logoutSuccess={jest.fn}
      history={createHistory()}
    />, { disableLifecycleMethods: true });
    comp.setState({ rides, tab: 'request' });
    const rideTable = comp.find(RideTableContainer);
    expect(rideTable.exists()).toBe(true);
    expect(rideTable.at(0).prop('rides')).toHaveLength(1);
  });
  test('Offer tab only shows offer ride(s)', () => {
    const comp = shallow(<Ride
      rides={rides}
      logoutSuccess={jest.fn}
      history={createHistory()}
    />, { disableLifecycleMethods: true });
    comp.setState({ rides, tab: 'offer' });
    const rideTable = comp.find(RideTableContainer);
    expect(rideTable.exists()).toBe(true);
    expect(rideTable.at(0).prop('rides')).toHaveLength(2);
  });
});

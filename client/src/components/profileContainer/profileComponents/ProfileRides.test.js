import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import createHistory from 'history/createMemoryHistory';
import RideContainer from '../../ridesContainer/ridesComponents/rideContainer/RideContainer';
import ProfileRides from './ProfileRides';

configure({ adapter: new Adapter() });

/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */
const rides = ([
  {
    passengers: [], _id: '5ae4ecaf4e1bdd00147e2b07', type: 'request', studentID: '', fulfilled: false, from: 'Hannaford Supermarket, Court Street, Middlebury, VT, USA', fromgeo: { lat: 44.0011809, lng: -73.1558293 }, to: 'Middlebury, VT, USA', togeo: { lat: 44.0153371, lng: -73.16733999999997 }, time: '14:00', date: '2018-05-30', seats_avail: 2, notes: '', price: 0, user: '5ad7cf596149e8001401024d',
  }, {
    passengers: ['5ad7cf596149e8001401024d'], _id: '5ae522018ba7d20014d398e9', type: 'request', studentID: '', fulfilled: true, from: 'New York, NY, USA', fromgeo: { lat: 40.7127753, lng: -74.0059728 }, to: 'Middlebury, VT, USA', togeo: { lat: 44.0153371, lng: -73.16733999999997 }, time: '15:00', date: '2018-05-24', seats_avail: 0, notes: '', price: 0, user: '5ae521cb8ba7d20014d398e8',
  }, {
    passengers: [], _id: '5ae74326d9625000145ae416', type: 'request', studentID: '', fulfilled: false, from: 'Georgia Avenue, Silver Spring, MD, USA', fromgeo: { lat: 39.0084192, lng: -77.04014540000003 }, to: 'Summerfield, NC, USA', togeo: { lat: 36.2087468, lng: -79.90475830000003 }, time: '00:12', date: '2018-05-01', seats_avail: 1, notes: '', price: 0, user: '5adfe362110b0e00148845a8',
  }, {
    passengers: [], _id: '5af5d2da5fcaaf0014ce001c', type: 'offer', studentID: '', fulfilled: false, from: 'Middlebury College, Old Chapel Road, Middlebury, VT, USA', fromgeo: { lat: 44.00825950000001, lng: -73.17731520000001 }, to: 'Georgetown University, O Street Northwest, Washington, DC, USA', togeo: { lat: 38.9076089, lng: -77.07225849999998 }, time: '14:00', date: '2018-06-21', seats_avail: 3, notes: '', price: 30, user: '5ad7cf596149e8001401024d',
  }]);

describe('ProfileRides', () => {
  test('Rides props show all rides (is not mutated) when type is request', () => {
    const comp = shallow(<ProfileRides
      rides={rides}
      user="5ad7cf596149e8001401024d"
      type="request"
      deleteRide={jest.fn}
      history={createHistory()}
    />, { disableLifecycleMethods: true });
    const container = comp.find(RideContainer);
    expect(container.exists()).toBe(true);
    expect(container.at(0).prop('rides')).toHaveLength(4);
  });

  test('Rides props show all rides (is not mutated) when type is offer', () => {
    const comp = shallow(<ProfileRides
      rides={rides}
      type="offer"
      user="5ad7cf596149e8001401024d"
      deleteRide={jest.fn}
      history={createHistory()}
    />, { disableLifecycleMethods: true });
    const container = comp.find(RideContainer);
    expect(container.exists()).toBe(true);
    expect(container.at(0).prop('rides')).toHaveLength(4);
  });
});

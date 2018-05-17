// types/index.js
// source: https://medium.freecodecamp.org/react-pattern-centralized-proptypes-f981ff672f3b
import { shape, number, string, arrayOf, bool } from 'prop-types';

export const locationType = shape({
  name: string.isRequired,
  lat: number,
  long: number,
});

export const rideType = shape({
  _id: string.isRequired,
  type: string.isRequired,
  studentID: string,
  fulfilled: bool.isRequired,
  from: string.isRequired,
  fromgeo: shape({ lat: number.isRequired, lng: number.isRequired }),
  to: string.isRequired,
  togeo: shape({ lat: number.isRequired, lng: number.isRequired }),
  time: string,
  date: string.isRequired,
  passengers: arrayOf(string),
  seats_avail: number.isRequired,
  notes: string,
  price: number,
  user: string.isRequired,
});

export const userType = shape({
  _id: string.isRequired,
  name: string.isRequired,
  email: string.isRequired,
  phoneNumber: number,
  avatar: string, // url, or null
  car: string,
  rides: arrayOf(rideType),
});

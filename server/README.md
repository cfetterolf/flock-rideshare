# MongoDB-backed Rideshare Server

A server for the rideshare website backed by MongoDB. 
The database will contain Rides and User profiles


## Setup

In the server directory, run `npm install` to install the dependencies and create a `./data` directory (as a "postinstall" script) for use by MongoDB.

The repository includes some sample data to seed the database. To seed the database, first start the database in one terminal with `npm run mongo` (which is equivalent to `mongod --config mongod.conf`) and then in a second terminal import the seed data with

```
mongoimport --db rideshare --collection rides --jsonArray ride-seed.json --port 5000
```

## Running

Still In the server directory, in one terminal, start MongoDB with `npm run mongo` (equivalent to `mongod --config mongod.conf`). Then in another terminal in server directory launch the application server  with `npm run start` (equivalent to `node index.js`). By default the application is available at <http://localhost:3001>.

At this point you should be able to get the rides from the server, to make sure the deployment of the server has been successful please use the following command in another terminal

```
curl http://localhost:3001/api/rides
```

## Development

### Testing with Jest

The server is configured for testing with the Jest test runner. Tests can be run in the server directory with:

```
npm test
```

### Linting with ESLint

The server is configured with the [AirBnB ESLint rules](https://github.com/airbnb/javascript). You can run the linter with `npm run lint` or `npx eslint .`. Thee rules were installed with:

```
npx install-peerdeps --dev eslint-config-airbnb-base
```

and `.eslintrc.json` configured with:

```
{
  "extends": "airbnb-base",
  "env": {
    "node": true,
    "jest": true,
    "es6": true
  },
  "rules": {
    "consistent-return": 0,
    "no-param-reassign": 0,
    "no-underscore-dangle": 0,
    "no-console": 0
  }
}
```

The linter can be run with `npx eslint .` (or via `npm run lint`). Include the `--fix` option to `eslint` to automatically fix many formatting errors.

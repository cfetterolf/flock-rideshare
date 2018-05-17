# Flock - Middlebury Rideshare Top-level [![Build Status](https://travis-ci.com/csci312a-s18/fp-rideshare.svg?token=phszY5kKN8BVNwskKt22&branch=master)](https://travis-ci.com/csci312a-s18/fp-rideshare)

This repository combines the client and server into a single repository that can be co-developed, tested and ultimately deployed to Heroku or basin.cs.middlebury.edu.

The client was created with [create-react-app](https://github.com/facebookincubator/create-react-app) (CRA) and the server is a separate Node.js application. The client-server integration is based on this [tutorial](https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/) and [repository](https://github.com/fullstackreact/food-lookup-demo). This repository will be referred to as the "top-level" to distinguish it from the client and server.

## Link to Deployed Application on Heroku

https://secret-plains-24328.herokuapp.com/
```
go/flockapp/
go/carpool/
```

### Testimonials

> [**“Nice! That README alone is already gold!”**]<br>
> — Anonymous SW Dev student

> [**“Awesome. Simply awesome.”**]<br>
> — Professor Linderman

> [**“I'm using it for a year now, it's an awesome carpooling website and the project is well maintained!”**]<br>
> — Chris Fetterolf

> [**“The security is on point and our app is not an open mailer ripe for abuse!"**]<br>
> — Baptiste Garcin

> [**“Our test coverage is over 9000%!”**]<br>
> — Holley Mcshan

> [**“I simply don't use a plane anymore!”**]<br>
> — Mariana Echeverria

> [**“What an outstanding directories architecture! I might have chosen the wrong major!”**]<br>
> — Anna Vasilchenko 

> [**“Implementing Google Maps was easier than tennis overhead smashing!”**]<br>
> — Kyle Schlanger

> [**“Never miss a saving money opportunity with non-intrusive notifications (faxs, emails, texts, postcards, messenger, pigeon)!”**]<br>
> — Stephanie Castaneda

> [**“No devices will be leaved behind, we support screens ranges between the NOKIA 3310 and the Samsung's 110-inch Ultra HDTV”**]<br>
> — Emilio Ovalles-misterman


## Gmail Account Info / Environment variables

You will find sensitive informations to access this gmail account and APIs in a .env 
file detained by Professor Linderman. This file should be placed in the Server directory and never pushed to Github 
(you should share this file through other alternatives).

## Helpful Tips

To add the --fix flag to your linting, use:
```
npm run lint --prefix client -- --fix
```

Steps to merge your changes into master:
1. Pull down the most recent changes to your (local) master branch
```
git pull origin master
```
2. Merge these changes into your branch, resolving conflicts if necessary
```
git checkout your_branch_name
git merge master
```
3. Commit and push your branch to Github
4. On Github, create a pull request for those commit(s)

## Installing Dependencies

The skeleton is structured as three separate packages and so the dependencies need to be installed independently in each of the top-level, the client and the server, i.e.:

```
npm install
npm install --prefix client
npm install --prefix server
```

## Running the Application

The combined application, client and server, can be run with `npm start` in the top-level directory. `npm start` launches the CRA development server on http://localhost:3000 and the backend server on http://localhost:3001. By setting the `proxy` field in the client `package.json`, the client development server will proxy any unrecognized requests to the server.

## Testing

The client application can be independently tested as described in the [CRA documentation](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#running-tests), i.e.:

```
npm test --prefix client
```

The server can be similarly independently tested:

```
npm test --prefix server
```

## Linting

Both the client and server can be independently linted via:

```
npm run lint --prefix client
```

and

```
npm run lint --prefix server
```

## Continuous Integration

The skeleton is setup for CI with Travis-CI. Travis will run build the client and test and lint both the client and the server.

## Deploying to Heroku

<img src="https://upload.wikimedia.org/wikipedia/en/a/a9/Heroku_logo.png" width="200">

FLOCK can be deployed to [Heroku](heroku.com) using the approach demonstrated in this [repository](https://github.com/mars/heroku-cra-node). The key additions to the top-level `package.json` file to enable Heroku deployment:

* Specify the node version in the `engines` field
* Add a `heroku-postbuild` script field that will install dependencies for the client and server and create the production build of the client application.
* Specify that `node_modules` should be cached to optimize build time

In addition a `Procfile` was added in the top-level package to start the server.

Assuming that you have a Heroku account, have installed the [Heroku command line tools](https://devcenter.heroku.com/articles/heroku-cli) and committed any changes to the application, to deploy to Heroku:

1. Create the Heroku app, e.g.:

    ```
    heroku apps:create
    ```
1. Instantiate the MongoDB:

     ```
    heroku addons:create mongolab:sandbox
    ``` 
    You will be asked to add a Credit Card information only for their verification purpose (nothing will be charger on your card)
    Once done it will return the MONGODB_URI, if not you can just type the command that will 
    get you all Environment variables
    
    ```
    heroku config
    ```
    
1. No seeding is necessary since all data can be created through the app
    
1. Instantiate the heroku environment variables:

    Either by using the Heroku CLI :
    ```
    heroku config:set DEV_SERVER=http://localhost:3001
    ```
Or through Heroku's dashboard : ```Your App> Settings> Config Vars```

1. Push to Heroku

    ```
    git push heroku master
    ```

Depending on how you implement your backend, you will likely need create "addons" for your database, etc. and migrate then seed your database before you deploy.

## Deploying to Basin

Your project can be deployed to basin.cs.middlebury.edu (where it is typically run within `screen` on an unused port). As with Heroku you will like need to create and seed your database before you deploy.

1. Build production assets for the client application (from the top-level directory):

    ```
    npm run heroku-postbuild
    ```

1. Start the server from the top-level directory (note you will need to pick an unused port):

  	```
  	NODE_ENV=production PORT=5042 npm run start --prefix server
  	```

## Documentation


![Database Diagram](server/documentation/DatabaseDiagram.png?raw=true "Title")

You can find more documentation about our API and try it out at this address

https://secret-plains-24328.herokuapp.com/docs


## Need Addressed by Application

A great amount of students at Middlebury College struggle to find transporation. This application will allow students who do not own a car to find rides in a cheaper and more efficient way. 

## Main Components of Application

1. **Profile:** Each user will need to create an account in order to use the app. Their profiles will display information about the user (phone number, reviews, car model and plate), and also information about their current ride offers and/or seat reservations.

2. **Post a Ride:** Users can post rides they are planning to make, specifying: place of origin, destination, seats available, date, time of departure and price. They can also post rides without specifying destintation and just giving distance they are willing to drive.

3. **Find a Ride:** Users can look up specific destinations and dates, and find rides already posted by other users. If the user finds a ride that matches their preference they can reserve a seat in the car.


### <img src="https://frontendmasters.com/assets/es6-logo.png" height="34" align="top"> ES6 Cheatsheet

#### Declarations

Declares a read-only named constant.

```js
const name = 'yourName';
```

Declares a block scope local variable.
```js
let index = 0;
```

#### Template Strings

Using the **\`${}\`** syntax, strings can embed expressions.

```js
const name = 'Oggy';
const age = 3;

console.log(`My cat is named ${name} and is ${age} years old.`);
```

#### Modules

To import functions, objects or primitives exported from an external module. These are the most common types of importing.

```js
const name = require('module-name');
```

```js
const { foo, bar } = require('module-name');
```

To export functions, objects or primitives from a given file or module.

```js
module.exports = { myFunction };
```

```js
module.exports.name = 'yourName';
```

```js
module.exports = myFunctionOrClass;
```

#### Spread Operator

The spread operator allows an expression to be expanded in places where multiple arguments (for function calls) or multiple elements (for array literals) are expected.

```js
myFunction(...iterableObject);
```
```jsx
<ChildComponent {...this.props} />
```

#### Promises

A Promise is used in asynchronous computations to represent an operation that hasn't completed yet, but is expected in the future.

```js
var p = new Promise(function(resolve, reject) { });
```

The `catch()` method returns a Promise and deals with rejected cases only.

```js
p.catch(function(reason) { /* handle rejection */ });
```

The `then()` method returns a Promise. It takes 2 arguments: callback for the success & failure cases.

```js
p.then(function(value) { /* handle fulfillment */ }, function(reason) { /* handle rejection */ });
```

The `Promise.all(iterable)` method returns a promise that resolves when all of the promises in the iterable argument have resolved, or rejects with the reason of the first passed promise that rejects.

```js
Promise.all([p1, p2, p3]).then(function(values) { console.log(values) });
```

#### Arrow Functions

Arrow function expression. Shorter syntax & lexically binds the `this` value. Arrow functions are anonymous.

```js
singleParam => { statements }
```
```js
() => { statements }
```
```js
(param1, param2) => expression
```
```js
const arr = [1, 2, 3, 4, 5];
const squares = arr.map(x => x * x);
```

#### Classes

The class declaration creates a new class using prototype-based inheritance.

```js
class Person {
  constructor(name, age, gender) {
    this.name   = name;
    this.age    = age;
    this.gender = gender;
  }

  incrementAge() {
    this.age++;
  }
}
```

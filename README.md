# Godin Frontend

Requires Node >= `6` for development.

Originally built with Node `v8.11.3` and NPM `v5.6.0`.

## Single build
Create a build which will output to the `dist` directory.
```
npm run build
```

## Development
Below is information for developers.

### First time setup
```
npm install
```

### Start the dev web server
This web server will watch files and rebuild as they change.
You will have to manually refresh the page as you make changes, but
trust me that's better than having a refresh every time you save your work.
This webserver will by default run on `http://localhost:8080`.
```
npm start
```

#### API while in development
All web requests to `/api` will be proxied to `http://localhost:6543/api`.
This means you either need to launch the Godin server on this port during
development or run the mock REST api.

### Mock REST API
You may edit `mockapi-db.json` to add more routes and values to the mock API.

To run the mock api:
```
npm run api
```

### Testing
Testing does not currently work. Need to convert runner over to Chrome.
Plus the fact I've forcefully upgraded Karma to version `3.0.0` because Github
is reporting a dependency vulnerability, the karma runner file will have to be
rewritten.

```
npm test
```

Live:
```
npm test-watch
```

### Route Registration
Specifics in regards to the enhanced options added to the router.

#### Page title
A route can register a page title suffix with the `pageTitle` attribute.

#### Main Navigation
In order to register a route into the main navigation, simply use the `mainNav` attribute.

As an example:

```js
.state({
  name: 'clientList',
  url: '/clients',
  component: 'clientsPage',
  pageTitle: 'Clients',
  mainNav: {
    title: 'Clients',
    weight: -90
  }
});
```

This registers the `Client` button with a weight of `-90`, meaning it'll be
just right of the "Dashboard" button as that has a weight of `-100`. Regular
entries should have positive numbers. If no value is specified for `weight`, it
will default to `0`.

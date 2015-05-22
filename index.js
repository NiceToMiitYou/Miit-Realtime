'use strict';

// Load dependencies
var Primus         = require('primus'),
    Rooms          = require('primus-rooms'),
    http           = require('http'),
    express        = require('express'),
    bodyParser     = require('body-parser'),
    cookieParser   = require('cookie-parser'),
    expressSession = require('express-session');

// Load custom dependencies
var Miit      = require('./src/miit.js'),
    PORT      = (process.env.NODE_ENV === 'production') ? 80 : 8080;


//
// Create an Express application.
//
var app    = express();
var secret = 'MySecretIsNotSoSecret';

var cookies = cookieParser(secret);
var session = expressSession({
    name:   'miit-session',
    secret: secret,
    resave: true,
    saveUninitialized: true
});

// Load middlewares in express
// Json parser
app.use(bodyParser.json());
// Coockie Parser
app.use(cookies);
// Session handler
app.use(session);


//
// Create an HTTP server and our Primus server.
//
var server = http.createServer(app),
    primus = new Primus(server, {
        transformer: 'sockjs',
        parser: 'JSON',
        session: {
            name:   'miit-session',
            secret: secret
        }
    });

function onReady() {
    //
    // Begin accepting connections.
    //
    server.listen(PORT, function listening() {
      console.log('Listening on port:', PORT);
    });
}

// use the same middleware for primus
primus.before('cookies', cookies);
primus.before('session', session);

// Enable rooms in primus
primus.use('rooms', Rooms);

// Instanciate the miit server
var miit = new Miit(primus, onReady);

'use strict';

// Load dependencies
var Primus         = require('primus'),
    Rooms          = require('primus-rooms'),
    http           = require('http');

// Load custom dependencies
var Miit      = require('./src/miit.js'),
    PORT      = (process.env.NODE_ENV === 'production') ? 80 : 8080;

//
// Create an HTTP server and our Primus server.
//
var server = http.createServer(),
    primus = new Primus(server, {
        transformer: 'sockjs',
        parser: 'JSON'
    });

function onReady() {
    //
    // Begin accepting connections.
    //
    server.listen(PORT, function listening() {
      console.log('Listening on port:', PORT);
    });
}

// Enable rooms in primus
primus.use('rooms', Rooms);

// Instanciate the miit server
var miit = new Miit(primus, onReady);

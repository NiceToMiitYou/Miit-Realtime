'use strict';

// Load dependencies
var http = require('http');

// Generate variables
var HOSTNAME = (process.env.NODE_ENV === 'production') ? 'api.miit.fr' : 'api.miit.dev';

// Helper method to wait the response
function waitForResponse(callback) {
    return function(response) {
        // Continuously update stream with data
        var body = '';

        response.on('data', function(d) {
            body += d;
        });
        
        response.on('end', function() {
            var data = JSON.parse(body);

            callback(data, response);
        });
    };
}

// Expose the object
module.exports = {
    checkAuthorization: function(userId, teamId, token, cb) {
        // Generate the path
        var path = '/' + userId + '/' + teamId + '/' token;

        // Request the server
        return http.get({
            host: HOSTNAME,
            path: path
        }, waitForResponse(function(data) {
            // Callback
            cb({});
        }));
    }
};
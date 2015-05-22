'use strict';

// Expose the object
module.exports = function Requests(miit, onReady) {
    
    // Get the access token object.
    var token, initialized = false;

    // create a cache
    var cache  = require('memory-cache');

    // Load dependencies
    var oauth2 = require('simple-oauth2')(miit.config);

    // Get the access token object for the client
    function getToken(callback) {
        var params = {};
        params.grant_type    = 'http://ws.miit.fr/';
        params.client_secret = miit.config.clientSecret;
        params.client_id     = miit.config.clientID;

        params.f22bc372e4297549cb8660226b5d7df1617f94bf = '423b3a6f2421a58bd22d4815cb91d98c12c8ba6e';

        oauth2.api('GET', miit.config.tokenPath, params, callback);
    }

    // Save the access token
    function saveToken(error, result) {
        if(error)
        {
            miit.logger.error('Access Token Error:', error, error.message);
        }
        else
        {
            if(false === initialized)
            {
                initialized = true;

                onReady();
            }

            miit.logger.debug(result);

            token = oauth2.accessToken.create(result);
        }
    }

    // Check if expire then request
    function checkExpire(replay, cb) {
        if(token && token.expired())
        {
            token.refresh(function(error, result) {
                if(error)
                {
                    miit.logger.error('Refresh Token Error:', error, error.message);

                    // Try to get the token again
                    getToken(function(error, result) {
                        // Save the token
                        saveToken(error, result);
                        // Replay the request
                        replay();
                    });
                }
                else
                {
                    token = result;
                    cb();
                }
            });
        }
        else
        {
            cb();
        }
    }

    // Request the server and check if token still valid
    function request(method, path, params, cb) {
        // Handle optional parameter
        if(typeof params === 'function') {
            cb = params;
            params = {};
        }

        var replay = function() {
            request(method, path, params, cb);
        };

        // Check if expired
        checkExpire(replay, function() {
            miit.logger.debug('Request to:', path);

            // Set the access token
            params.access_token = token.token.access_token;

            // Cache system
            var cacheValue = cache.get(path);

            if(method !== 'GET' || !cacheValue) {
                // Send the request
                oauth2.api(method, path, params, function(error, data) {
                    miit.logger.debug('Data from request:', data);

                    // Add to cache
                    cache.put(path, data, 60000);

                    // Callback
                    if(typeof cb === 'function') {
                        cb(error, data);
                    }
                });
            }
            else
            {
                miit.logger.debug('Data from cache:', cacheValue);

                // Callback
                if(typeof cb === 'function') {
                    cb(null, cacheValue);
                }
            }
        });
    }

    // Shortcut for GET
    function get(path, params, cb) {
        request('GET', path, params, cb);
    }

    // Shortcut for POST
    function post(path, params, cb) {
        request('POST', path, params, cb);
    }

    // Shortcut for PUT
    function put(path, params, cb) {
        request('PUT', path, params, cb);
    }

    // Shortcut for DELETE
    function del(path, params, cb) {
        request('DELETE', path, params, cb);
    }

    // Retrieve the token
    getToken(saveToken);

    // Return public methods
    return {
        checkAuthorization: function(userId, teamId, token, cb) {
            // Generate the path
            var path = '/realtime/check/' + userId + '/' + teamId + '/' + token;

            get(path, function(error, data) {
                cb(data);
            });
        },

        request: request,
        get:     get,
        post:    post,
        put:     put,
        delete:  del
    };
};
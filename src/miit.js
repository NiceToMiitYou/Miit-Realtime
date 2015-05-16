'use strict';

var authorize = require('./authorize.js'),
    logger    = require('./logger.js');

module.exports = function Miit(primus) {
    //
    // Add the authorization hook.
    //
    primus.authorize(authorize);


    primus.on('connection', function connection(spark) {
        logger.info('New connection.');
    });

    primus.on('disconnection', function disconnection(spark) {
        logger.info('Disconnection.');
    });

    primus.on('error', function error(err) {
        logger.error('Something horrible has happened.', err.stack);
    });
};
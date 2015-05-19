
'use strict';

module.exports = function ConnectionManager(miit) {

    miit.primus.on('connection', function(spark) {
        miit.logger.info('Someone is connected.');
    });

    miit.primus.on('disconnection', function(spark) {
        miit.logger.info('Someone is disconnected.');
    });
};

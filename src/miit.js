'use strict';

function Miit(primus) {
    // The configuration of the application
    this.config = require('./config');

    // The logger
    this.logger = require('./logger');

    // Primus
    this.primus = primus;

    //
    // Add the authorization hook.
    //

    var authorize = require('./authorize').bind(this);
    var requests  = require('./requests');

    this.primus.authorize(authorize);

    this.requests = requests(this);
};

module.exports = Miit;
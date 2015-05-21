'use strict';

var Apps = [
    'Chat'
];

var Models = [
    'Status',
    'User',
    'Team'
];

var Stores = [
    'TeamStore',
    'StatusStore'
];

var Managers = [
    'ConnectionManager'
];


function loadAllInstances(miit) {
    // For each Models
    Models.forEach(function(model) {
        var path = './models/' + model;

        miit.models[model] = require(path)(miit);
    });

    // For each Stores
    Stores.forEach(function(store) {
        var path = './stores/' + store;
        var Store = require(path);

        miit.stores[store] = new Store(miit);
    });

    // For each Managers
    Managers.forEach(function(manager) {
        var path = './managers/' + manager;
        var Manager = require(path);

        miit.managers[manager] = new Manager(miit);
    });

    // For each Apps
    Apps.forEach(function(app) {
        var path = './apps/' + app;
        var App  = require(path);

        var AppInstance = new App(miit);
        var identifier  = AppInstance.identifier();

        miit.apps[identifier] = AppInstance;
    });
}

function Miit(primus, onReady) {
    var miit = this;

    // The configuration of the application
    miit.config = require('./config');

    // The logger
    miit.logger = require('./logger');

    // Mongoose
    miit.mongoose = require('mongoose');

    // Primus
    miit.primus = primus;

    //
    // Connect to the mongo server
    //
    miit.mongoose.connect(miit.config.mongo.uri, miit.config.mongo.options);
    miit.mongoose.connection.once('open', miit.logger.debug.bind(miit.logger, 'Mongo connection opened.'));
    miit.mongoose.connection.on('error',  miit.logger.error.bind(miit.logger, 'Mongo connection error:'));

    //
    // Load all instances needed
    //
    miit.apps     = {};
    miit.managers = {};
    miit.models   = {};
    miit.stores   = {};

    loadAllInstances(miit);

    //
    // Add the authorization hook.
    //

    var authorize = require('./authorize').bind(this);
    var requests  = require('./requests');

    miit.primus.authorize(authorize);

    //
    // Initialize request and give onReady to finalize initialization
    //
    miit.requests = requests(this, onReady);
};

module.exports = Miit;
'use strict';

module.exports = function ConnectionManager(miit) {
    var StatusStore = miit.stores.StatusStore;
    var UserStore   = miit.stores.UserStore;
    var TeamStore   = miit.stores.TeamStore;

    function initializeConnections(spark, user, team) {
        // Bind event from client
        spark.on('data', function (data){
            miit.logger.info(data);
            miit.logger.info(spark.reserved(data.event));

            if(spark.reserved(data.event)) return;

            spark.emit.call(spark, data.event, data);
        });

        // Check statut
        checkStatuts(spark, user, team);

        // Bind status
        onGetStatus(spark, user, team);

        // Bind users
        onGetUsers(spark, user, team);
    }

    function onGetUsers(spark, user, team) {
        spark.on('users:list', function(){
            miit.logger.debug('Status asked by User', user.id);

            TeamStore.getUsers(team, function(err, users){
                spark.write({
                    event: 'users:list',
                    users: users
                });
            });
        });
    }

    function onStatusChanged(team) {
        return function(err, status, changed) {
            if(changed) {
                miit.primus.in(team.id).write({
                    event:  'user:status',
                    status: status
                });
            }
        }
    }

    function onGetStatus(spark, user, team) {
        spark.on('users:status', function(){
            miit.logger.debug('Status asked by User', user.id);

            StatusStore.getStatus(team, function(err, status){
                spark.write({
                    event:  'users:status',
                    status: status
                });
            });
        });
    }

    // Add a status check on ping
    function checkStatuts(spark, user, team) {
        spark.on('incoming::ping', function(){
            miit.logger.debug('Heartbeat from', user.id);

            StatusStore.setUserOnline(user, team, onStatusChanged(team));
        });
    }

    // On user connection
    miit.primus.on('connection', function(spark) {
        miit.logger.info('Someone is connected.');

        var user = spark.request.user;
        var team = spark.request.team;

        var apps = team.apps || [];

        // Join the team room
        spark.join(team.id);

        // Initialize other components
        initializeConnections(spark, user, team);

        apps.forEach(function(identifier) {
            var app = miit.apps[identifier];

            // Join the app room
            spark.join(team.id + ':' + identifier);

            if(typeof app.onConnection === 'function') {
                app.onConnection(spark, user, team);
            }
        });
        
        // Set the user Online
        StatusStore.setUserOnline(user, team, onStatusChanged(team));
    });

    // On user disconnection
    miit.primus.on('disconnection', function(spark) {
        miit.logger.info('Someone is disconnected.');

        var user = spark.request.user;
        var team = spark.request.team;

        var apps = team.apps || [];

        apps.forEach(function(identifier) {
            var app = miit.apps[identifier];

            if(typeof app.onDisconnection === 'function') {
                app.onDisconnection(spark, user, team);
            }
        });

        // Set the user Offline when detected
        StatusStore.setUserOffline(user, team, onStatusChanged(team));
    });
};

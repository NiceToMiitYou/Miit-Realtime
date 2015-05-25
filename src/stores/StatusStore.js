'use strict';

module.exports = function StatusStore(miit) {

    var Status = miit.models.Status;

    function updateStatus(status, user, team, cb)  {
        Status.findOneAndUpdate({
                userId: user.id || '',
                teamId: team.id || ''
            }, {
                status: status,
                userId: user.id || '',
                teamId: team.id || '',
                changed: new Date()
            }, {
                upsert: true,
                "new": false
            }, function(err, old) {
                // Log the error
                if(err) {
                    miit.logger.error(err);
                }

                if(typeof cb === 'function') {
                    cb(err, {
                        status: status,
                        userId: user.id || ''
                    }, (old || {}).status !== status);
                }
            });
    }

    this.setUserOnline = function(user, team, cb) {
        updateStatus('ONLINE', user, team, cb);
    };

    this.setUserOffline = function(user, team, cb) {
        updateStatus('OFFLINE', user, team, cb);
    };

    this.getStatus = function(team, cb) {
        Status
            .find({
                teamId: team.id
            }, {
                _id: false,
                userId: true,
                status: true
            })
            .exec(function(err, status) {
                // Log the error
                if(err) {
                    miit.logger.error(err);
                }

                if(typeof cb === 'function') {
                    cb(err, status);
                }
            });
    };

    this.getStatusByUserId = function(team, userId, cb) {
        Status
            .findOne({
                teamId: team.id,
                userId: userId
            }, {
                _id: false,
                userId: true,
                status: true
            })
            .exec(function(err, status) {
                // Log the error
                if(err) {
                    miit.logger.error(err);
                }

                if(typeof cb === 'function') {
                    cb(err, status);
                }
            });
    };
};
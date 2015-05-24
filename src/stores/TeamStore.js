'use strict';

module.exports = function TeamStore(miit) {

    var User = miit.models.User;
    var Team = miit.models.Team;

    this.createIfNotExist = function(team, cb) {
        if(!team) {
            return;
        }

        Team.update({
            id: team.id
        }, {
            id:           team.id,
            name:         team.name,
            slug:         team.slug,
            public:       team.public,
            locked:       team.locked,
            applications: team.applications
        }, {
            upsert: true
        }, function(err, raw) {
            // Log the error
            if(err) {
                miit.logger.error(err);
            }
            if(typeof cb === 'function') {
                cb(err);
            }
        });
    };

    this.addUserIfNotExist = function(team, user_id, cb) {
        if(!team || !user_id) {
            return;
        }

        var conditions = {
            id: team.id,
            'users.user': { $ne: user_id }
        };

        var update = {
            $addToSet: {
                users: {
                    user: user_id
                }
            }
        };

        Team.findOneAndUpdate(conditions, update, function(err, doc) {
            // Log the error
            if(err) {
                miit.logger.error(err);
            }
            if(typeof cb === 'function') {
                cb(err, doc);
            }
        });
    };

    this.getUsers = function(team, cb) {
        Team
            .findOne({
                id: team.id
            }, {
                _id: false
            })
            .populate('users.user')
            .exec(function(err, team) {
                // Log the error
                if(err) {
                    miit.logger.error(err);
                }

                if(typeof cb === 'function') {
                    var users = ((team || {}).users || []).map(function(user) {
                        return (user || {}).user;
                    });

                    cb(err, users);
                }
            });
    };
};
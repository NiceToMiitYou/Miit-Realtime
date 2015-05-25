'use strict';

module.exports = function TeamStore(miit) {

    var User = miit.models.User;
    var Team = miit.models.Team;

    this.create = function(team, cb) {
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

    this.addUser = function(team, user_id, roles, cb) {
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
                    user:  user_id,
                    roles: roles
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
                id:  team.id
            }, {
                _id: false
            })
            .populate({
                path:   'users.user',
                select: '-_id id name avatar'
            })
            .exec(function(err, team) {
                // Log the error
                if(err) {
                    miit.logger.error(err);
                }

                if(typeof cb === 'function') {
                    var users = ((team || {}).users || []).map(function(userTeam) {
                        var user =  (userTeam || {}).user || {};
                        
                        user.roles = userTeam.roles;

                        return user;
                    });

                    cb(err, users);
                }
            });
    };
};
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

    this.addUserIfNotExist = function(team, user, cb) {
        if(!team || !user) {
            return;
        }

        var conditions = {
            id: team.id,
            'users.id': { $ne: user.id }
        };

        var user = new User({
            id:     user.id,
            name:   user.name   || '',
            email:  user.email  || '',
            avatar: user.avatar || '',
            roles:  user.roles  || []
        });

        var update = {
            $addToSet: {
                users: user
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
                _id: false,
                'users.id':     true,
                'users.name':   true,
                'users.avatar': true,
                'users.roles':  true
            })
            .exec(function(err, team) {
                // Log the error
                if(err) {
                    miit.logger.error(err);
                }

                if(typeof cb === 'function') {
                    cb(err, (team || {}).users || []);
                }
            });
    };
};
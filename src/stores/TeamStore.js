'use strict';

module.exports = function TeamStore(miit) {

    var User = miit.models.User;
    var Team = miit.models.Team;

    this.createIfNotExist = function(team, cb) {
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
        var conditions = {
            id: team.id,
            'users.id': { $ne: user.id }
        };

        var user = new User({
            id:    user.id,
            name:  user.name  || '',
            email: user.email || '',
            roles: user.roles || []
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
};
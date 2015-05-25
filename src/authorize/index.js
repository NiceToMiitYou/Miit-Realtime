'use strict';

// Instanciate the authorization function
module.exports = function (req, done) {
    var miit = this;

    var userId = req.query.userId,
        teamId = req.query.teamId,
        token  = req.query.token;

    if (!userId || !teamId || !token)
    {
        return done({
            statusCode: 403,
            message: 'Go away!'
        });
    }
    else
    {
        miit.requests.checkAuthorization(userId, teamId, token, function(data) {
            if(data && data.type && data.type !== 'SESSION_UNDEFINED')
            {
                var TeamStore = miit.stores.TeamStore;
                var UserStore = miit.stores.UserStore;

                var user = data.user;
                var team = data.team;

                // Create the team
                TeamStore.create(team, function(err) {
                    UserStore.create(user, function(errUser, doc) {
                        if(!err && !errUser) {
                            miit.stores.TeamStore.addUser(team, doc._id, user.roles);
                        }
                    });
                });

                req.user = user;
                req.team = team;

                return done();
            }
            else
            {
                return done({
                    statusCode: 403,
                    message: 'SESSION_UNDEFINED'
                });
            }
        });
    }
};
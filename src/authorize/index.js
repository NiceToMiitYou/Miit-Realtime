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
                miit.stores.TeamStore.createIfNotExist(data.team, function(err) {
                    if(!err) {
                        miit.stores.TeamStore.addUserIfNotExist(data.team, data.user);
                    }
                });

                req.user = data.user;
                req.team = data.team;

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
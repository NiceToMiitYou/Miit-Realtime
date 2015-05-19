'use strict';

// Instanciate the authorization function
module.exports = function (req, done) {
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
        this.requests.checkAuthorization(userId, teamId, token, function(data) {
            if(data.type !== 'SESSION_UNDEFINED')
            {
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
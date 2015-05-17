'use strict';

// Instanciate the authorization function
module.exports = function (req, done) {
    var userId = req.query.userId,
        teamId = req.query.teamId,
        token  = req.query.token;

    this.requests.checkAuthorization(userId, teamId, token);

    if (!userId || !teamId || !token) {
        return done({
            statusCode: 403,
            message: 'Go away!'
        });
    } else {
        return done();
    }
};
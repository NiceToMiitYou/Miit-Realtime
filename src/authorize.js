
module.exports = function (req, done) {
    var userId = req.query.userId,
        teamId = req.query.teamId,
        token  = req.query.token;

    console.log('userId:', userId);
    console.log('teamId:', teamId);
    console.log('token:',  token);

    if (!userId || !teamId || !token) {
        return done({
            statusCode: 403,
            message: 'Go away!'
        });
    } else {
        return done();
    }
};
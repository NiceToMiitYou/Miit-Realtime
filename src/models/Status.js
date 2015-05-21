

module.exports = function User(miit) {

    var schema = new miit.mongoose.Schema({
        teamId: String,
        userId: String,
        status: String,
        changed: { type: Date, expires: 120, default: Date.now }
    });

    return miit.mongoose.model('Status', schema);
};
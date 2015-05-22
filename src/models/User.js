

module.exports = function User(miit) {

    var schema = new miit.mongoose.Schema({
        id:     String,
        name:   String,
        email:  String,
        avatar: String,
        roles:  [String],
        expire: { type: Date, expires: 86400, default: Date.now }
    });

    return miit.mongoose.model('User', schema);
};
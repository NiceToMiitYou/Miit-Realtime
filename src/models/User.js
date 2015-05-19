

module.exports = function User(miit) {

    var schema = new miit.mongoose.Schema({
        id:    String,
        name:  String,
        email: String,
        roles: [String]
    });

    return miit.mongoose.model('User', schema);
};
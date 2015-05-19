'use strict';

module.exports = function Team(miit) {

    var schema = new miit.mongoose.Schema({
        id:           String,
        name:         String,
        slug:         String,
        locked:       Boolean,
        public:       Boolean,
        users:        [miit.models.User.schema],
        applications: [String]
    });

    return miit.mongoose.model('Team', schema);
};
'use strict';

module.exports = function Team(miit) {

    var ObjectId = miit.mongoose.Schema.Types.ObjectId;

    var schema = new miit.mongoose.Schema({
        id:           String,
        name:         String,
        slug:         String,
        locked:       Boolean,
        public:       Boolean,
        users:        [{
            user:     { 
                type: ObjectId,
                ref: 'User'
            },
            expire: {
                type: Date,
                expires: 86400,
                default: Date.now
            }
        }],
        applications: [String]
    });

    return miit.mongoose.model('Team', schema);
};
'use strict';

module.exports = function UserStore(miit) {

    var User = miit.models.User;

    this.createIfNotExist = function(user, cb) {
        if(!user) {
            return;
        }

        User.findOneAndUpdate({
            id: user.id
        }, {
            id:     user.id,
            name:   user.name   || '',
            email:  user.email  || '',
            avatar: user.avatar || '',
            roles:  user.roles  || []
        }, {
            upsert: true,
            "new":  true
        }, function(err, doc) {

            // Log the error
            if(err) {
                miit.logger.error(err);
            }
            if(typeof cb === 'function') {
                cb(err, doc);
            }
        });
    };


    this.getUser = function(userId, cb) {
        User
            .findOne({
                id: userId
            })
            .exec(function(err, user) {
                // Log the error
                if(err) {
                    miit.logger.error(err);
                }

                if(typeof cb === 'function') {
                    cb(err, user);
                }
            });
    };
};
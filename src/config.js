'use strict';

// The configuration of the application
module.exports = {
    mongo: {
        uri: 'mongodb://miit.dev/Miit',
        options:  {
            poolSize: 5,
            socketOptions: {
                noDelay: true,
                connectTimeoutMS: 0,
                socketTimeoutMS: 0
            }
        }
    },
    clientID:     'ad5c0799-fc88-11e4-828a-080027c7e7dd_4epik5g0veeco0wg4c8g8kgg8w0wc4wcs0cs0gks000w8cows4',
    clientSecret: '61tdhj8oru04s4g0kg40w4k48w84wow0w48kcko0ogsgkkks8w',
    site: (process.env.NODE_ENV === 'production') ? 'https://api.miit.fr' : 'http://api.miit.dev',
    tokenPath: '/oauth/v2/token'
};

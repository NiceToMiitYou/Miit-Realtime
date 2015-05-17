var winston = require('winston');

// Add colors to winston
winston.addColors({
    debug: 'green',
    error: 'red',
    info: 'blue',
    warn: 'yellow'
});

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: (process.env.NODE_ENV === 'production') ? 'warn' : 'silly',
            colorize: true
        })
    ]
});

// Generate the logger
module.exports = logger;
let config;
console.log('Environment:', process.env.NODE_ENV);

switch(process.env.NODE_ENV) {
    case 'production':
        config = require('./env/production');
        break;
    case 'test':
    case 'development':
        config = require('./env/development');
        break;
}

module.exports = config;


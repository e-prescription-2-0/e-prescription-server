const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        port: process.env.PORT || 3030,
        dbURL: 'mongodb://localhost:27017/e-v1',
        origin: ['http://localhost:3000']
    },
    production: {
        port: process.env.PORT || 3000,
        dbURL: process.env.DB_URL_CREDENTIALS,
        origin: []
    }
};

module.exports = config[env];
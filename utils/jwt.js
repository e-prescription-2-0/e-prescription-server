const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || 'v2-E-prescr';

function createToken(data) {
    return jwt.sign(data, secret);
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, data) => {
            if (err) {
                
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

module.exports = {
    createToken,
    verifyToken
}
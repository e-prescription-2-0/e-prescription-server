const jwt = require('../utils/jwt');
const { userTokenName } = require('../config/app-config');
const {userModel} = require('../models');

function auth(redirectUnauthenticated = true) {

    return function (req, res, next) {
        const token = req.headers[userTokenName] || '';
        Promise.all([
            jwt.verifyToken(token),
            
        ])
            .then(([data]) => {
               
                userModel.findById(data.id)
                    .then(user => {
                        req.user = user;
                        req.isLogged = true;
                        next();
                    })
            })
            .catch(err => {
                if (!redirectUnauthenticated) {
                    next();
                    return;
                }
                if (['token expired', 'jwt must be provided'].includes(err.message)) {
                    console.error(err);
                    res
                        .status(401)
                        .send({ message: "Invalid token!" });
                    return;
                }
                next(err);
            });
    }
}

module.exports = auth;
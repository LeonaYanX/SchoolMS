const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');




const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, jwtConfig.secretKey, { expiresIn });
};





module.exports = { generateToken};

const env = require('dotenv');
env.config();

const jwt = require('jsonwebtoken');


const JWT_KEY = process.env.JWT_KEY;

if (!JWT_KEY) {
    console.log('JWY secret key is not defined.');
    process.exit(1);
}

// Middleware function that verifies the client is using a valid token
module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) return res.status(401).send('Access denied. No token provided.')

    try {
        const decoded = jwt.verify(token, JWT_KEY);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.')
    }
}

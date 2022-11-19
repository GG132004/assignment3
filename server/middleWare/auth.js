const jwt = require('jsonwebtoken')
const tokenSecret = "my-token-secret"



const auth = async (req, res, next) => {
    // Get token from header
    const token = await req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        jwt.verify(token, tokenSecret, (error, decoded) => {
            if (error) {
                return res.status(401).json({ msg: 'Token is not valid' });
            } else {
                req.user = decoded;
                //  console.log( req.user)
                next();
            }
        });
    } catch (err) {
        console.error('something wrong with auth middleware');
        res.status(500).json({ msg: 'Server Error' });
    }
}

module.exports = {
    auth
}
const jwt = require('jsonwebtoken');
const jwtSecret = 'cca5b1a591c7119ea33bbd24f8540f724601d0785150df29f43172cb1ab3892ef0f515' //Should be in an environment variable
exports.adminAuth = (req, res, next) => {
    const token = req.cookie.jwt;
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if(err) {
                return res.status(401).json({message: "Not Authorized"})
            } else {
                if (decodedToken.role !== 'admin') {
                    return res.status(401).json({message: "Not authorized"})
                } else {
                    next();
                }
            }
        });
    } else {
        return res
        .status(401)
        .json({message: "Not authorized, token expired"})
    }
}
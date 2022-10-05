const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();
const key = process.env.Secret_Key;


const authorization = (req, res, next) => {

    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({
            message: "You are not logged in, please login"
        })
    }

    // check the correctness of the token
    jsonwebtoken.verify(token, key, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: "Your session is expired, please login again"
            })
        }
        req.user = decoded;
        next();
    })

}


module.exports = {
    authorization
}
const jwt = require('jsonwebtoken');

const generateJWTToken = (res, userID) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn:"7d" });

    res.cookie('token', token, {
        httpOnly:true, //coookie cannot be accessed by client side scripts
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7*24*60*60*1000

    });

    return token;
}
module.exports = { generateJWTToken };
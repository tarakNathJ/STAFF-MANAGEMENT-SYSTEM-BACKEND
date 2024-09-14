const JWT = require('jsonwebtoken');
require('dotenv').config();
const User = require('../Modules/User');


exports.auth = async(req, res, next) => {
    try {
        // extrack token
        const token = req.cookies.token || req.header("Authorisation").replace("Bearer ", "");
        // chack token are present or not


        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token is missing"
            })
        }

        try {
            // decode token using serect key
            const decode = JWT.verify(token, process.env.JWT_SECRET);

            req.ActiveUser = decode;


        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            })
        }
        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "sumething went wrong while validating the token"

        });

    }
}



// Is admin
exports.IsAdmin = async(req, res, next) => {
    try {

        if (req.ActiveUser.AccountType !== "ADMIN") {
            return res.status(401).json({
                success: false,
                message: "this is a protected route for ADMIN only"

            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified"
        });
    }

}
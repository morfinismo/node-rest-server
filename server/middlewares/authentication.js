const jwt = require("jsonwebtoken");

// Verify token
let tokenVerification = (req, res, next) => {
    let token = req.get("Authorization");
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Invalid token"
                }
            });
        }
        req.user = decoded.user;
        next();
    });
};


//Verify admin role
let verifyAdminRole = (req, res, next) => {
    let user = req.user;
    let role = user.role;
    if (role === "ADMIN_ROLE") {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: "You don't have permissions to perform this action."
            }
        });
    }
};


let verifyImgToken = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Invalid token"
                }
            });
        }
        req.user = decoded.user;
        next();
    });
};


module.exports = {
    tokenVerification,
    verifyAdminRole,
    verifyImgToken
};
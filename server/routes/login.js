const express = require('express');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

app.post("/login", (req, res) => {
    let body = req.body;
    User.findOne({
        email: body.email
    }, (err, dbUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Incorrect (user) or password"
                }
            });
        }
        if (!bcrypt.compareSync(body.password, dbUser.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Incorrect user or (password)"
                }
            });
        }

        let token = jwt.sign({
            user: dbUser
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXP });

        res.json({
            ok: true,
            user: dbUser,
            token
        });
    });
});


//Google configs
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post("/google", async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            err: e.message
        });
    });

    User.findOne({ email: googleUser.email }, (err, dbUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (dbUser) {
            if (!dbUser.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "You already have a user with email and password and you must use that."
                    }
                });
            } else {
                let token = jwt.sign({
                    user: dbUser
                }, process.env.SEED, { expiresIn: process.env.TOKEN_EXP });

                return res.json({
                    ok: true,
                    user: dbUser,
                    token
                });
            }
        } else {
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.picture;
            user.google = true;
            user.password = ":D";

            user.save((err, dbUser) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    user: dbUser
                }, process.env.SEED, { expiresIn: process.env.TOKEN_EXP });

                return res.json({
                    ok: true,
                    user: dbUser,
                    token
                });

            });
        }
    });
});


module.exports = app;
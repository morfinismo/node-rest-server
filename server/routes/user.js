const express = require('express');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const _ = require("underscore");
const app = express();


app.get('/', function(req, res) {
    res.json('Hello World');
});

app.get('/user', function(req, res) {

    let from = Number(req.query.from);
    if (typeof(from) !== "number") {
        from = 0;
    }

    let paging = Number(req.query.paging);
    if (typeof(paging) !== "number") {
        paging = 5;
    }

    User.find({ status: true }, "name email role status img")
        .skip(from)
        .limit(paging)
        .exec((err, usersArray) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            User.count({ status: true }, (err, total) => {
                res.json({
                    ok: true,
                    count: total,
                    usersArray
                });
            });
        });

});

app.post('/user', function(req, res) {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, dbUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: dbUser
        });
    });

});

app.put('/user/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ["name", "email", "img", "status"]);
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, dbUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: dbUser
        });
    });
});

app.delete('/user/:id', function(req, res) {
    let id = req.params.id;
    // User.findByIdAndRemove(id, (err, deletedUser) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if (!deletedUser) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: "User not found"
    //             }
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         user: deletedUser
    //     })
    // });
    let statusChange = { status: false };
    User.findByIdAndUpdate(id, statusChange, { new: false }, (err, dbUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!dbUser || dbUser.status === false) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "User not found"
                }
            });
        }
        dbUser.status = false;
        res.json({
            ok: true,
            user: dbUser
        });
    });

});

module.exports = app;
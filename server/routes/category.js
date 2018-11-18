const express = require("express");
let { tokenVerification, verifyAdminRole } = require("../middlewares/authentication");
let app = express();
let Category = require("../models/category");


app.get("/category", tokenVerification, (req, res) => {
    Category.find({})
        .populate("user", "name email")
        .exec((err, categoryArray) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Category.count((err, total) => {
                res.json({
                    ok: true,
                    count: total,
                    categoryArray
                });
            });
        });
});

app.get("/category/:id", tokenVerification, (req, res) => {
    var catId = req.params.id;
    Category.findById(catId, (err, dbCategory) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!dbCategory) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Category not found"
                }
            });
        }

        res.json({
            ok: true,
            category: dbCategory
        });

    });
});

app.post("/category", tokenVerification, (req, res) => {
    let body = req.body;

    let category = new Category({
        name: body.name,
        description: body.description,
        user: req.user._id
    });

    category.save((err, dbCategory) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: dbCategory
        });
    });
});

app.put("/category/:id", tokenVerification, (req, res) => {
    let id = req.params.id;
    Category.findByIdAndUpdate(id, { description: req.body.description }, { new: true, runValidators: true }, (err, dbCategory) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: dbCategory
        });
    });
});

app.delete("/category/:id", [tokenVerification, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    Category.findByIdAndDelete(id, (err, deletedCat) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!deletedCat) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Category not found"
                }
            });
        }
        res.json({
            ok: true,
            category: deletedCat
        });
    });
});

module.exports = app;
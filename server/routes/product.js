const express = require("express");
const { tokenVerification } = require("../middlewares/authentication");
let app = express();
let Product = require("../models/product");


app.get("/products", tokenVerification, (req, res) => {

    let from = Number(req.query.from);
    if (typeof(from) !== "number") {
        from = 0;
    }

    let limit = Number(req.query.limit);
    if (typeof(limit) !== "number") {
        limit = 10;
    }
    Product.find({ available: true })
        .skip(from)
        .limit(limit)
        .exec((err, productsList) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Product.count({ available: true }, (err, total) => {
                return res.json({
                    ok: true,
                    count: total,
                    productsList
                });
            });
        });
});

app.get("/products/:id", tokenVerification, (req, res) => {
    let id = req.params.id;
    Product.findById(id)
        .populate("user", "name, email")
        .populate("category", "name description")
        .exec((err, dbProduct) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                product: dbProduct
            });
        });
});


app.get("/products/search/:hint", tokenVerification, (req, res) => {

    let searchVal = req.params.hint;
    let regex = new RegExp(searchVal, "i");

    Product.find({ name: regex })
        .populate("category", "name description")
        .exec((err, productsList) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productsList
            });
        });
});

app.post("/products", tokenVerification, (req, res) => {
    let body = req.body;
    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        category: body.category,
        user: req.user._id
    });

    product.save((err, dbProduct) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            product: dbProduct
        });
    });
});

app.put("/products/:id", tokenVerification, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, dbProduct) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        dbProduct.name = body.name;
        dbProduct.description = body.description;
        dbProduct.unitPrice = body.unitPrice;
        dbProduct.available = body.available || true;
        dbProduct.category = body.category;

        dbProduct.save((err, savedProduct) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: savedProduct
            })
        });
    });
});

app.delete("/products/:id", tokenVerification, (req, res) => {
    let id = req.params.id;
    Product.findById(id, (err, dbProduct) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        dbProduct.available = false;
        dbProduct.save((err, updatedProduct) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: false,
                product: updatedProduct
            });
        });
    });
});


module.exports = app;
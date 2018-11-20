const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require("../models/user");
const Product = require("../models/product")
const fs = require("fs");
const path = require("path");

//file upload options
app.use(fileUpload());


app.put('/upload/:type/:id', function(req, res) {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "No files were uploaded"
            }
        });
    }

    let validTypes = ["products", "users"];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            message: "Inavlid type. Valid types are: " + validTypes.join()
        });
    }

    let sampleFile = req.files.sampleFile;
    let fileNameSplit = sampleFile.name.split(".");
    let fileExt = fileNameSplit[fileNameSplit.length - 1];

    //permitted file types
    let validExts = ["png", "jpg", "gif", "jpeg"];

    if (validExts.indexOf(fileExt) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "Invalid file type. Valid types are: " + validExts.join()
            }
        })
    }

    //change file name
    let fileName = `${id}-${new Date().getMilliseconds()}.${fileExt}`

    sampleFile.mv(`uploads/${type}/${fileName}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (type === "users") { userImage(id, res, fileName); }
        if (type === "products") { productImage(id, res, fileName); }
    });
});


function userImage(id, res, fileName) {
    User.findById(id, (err, dbUser) => {
        if (err) {
            deleteFile(fileName, "users");
            return res.status(500).json({
                ok: false,
                err
            });
        }

        deleteFile(dbUser.img, "users");

        dbUser.img = fileName;
        dbUser.save((err, savedUser) => {
            res.json({
                ok: true,
                user: savedUser,
                img: fileName
            });
        });
    });
}

function productImage(id, res, fileName) {
    Product.findById(id, (err, dbProduct) => {
        if (err) {
            deleteFile(fileName, "products");
            return res.status(500).json({
                ok: false,
                err
            });
        }

        deleteFile(dbProduct.img, "products");

        dbProduct.img = fileName;
        dbProduct.save((err, savedProduct) => {
            res.json({
                ok: true,
                user: savedProduct,
                img: fileName
            });
        });
    });
}

function deleteFile(fileName, typePath) {
    let pathImage = path.resolve(__dirname, "../../uploads/" + typePath + "/" + fileName);
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;
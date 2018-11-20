const express = require("express");
const fs = require("fs");
const path = require("path");
const { verifyImgToken } = require("../middlewares/authentication");
const app = express();


app.get("/images/:type/:img", verifyImgToken, (req, res) => {
    let type = req.params.type;
    let img = req.params.img;
    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        res.sendFile(path.resolve(__dirname, "../assets/no_img.png"));
    }
});

module.exports = app;
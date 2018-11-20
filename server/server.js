require("./config/config");
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require("path");
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//enable public folder
app.use(express.static(path.resolve(__dirname, "../public")));

//global routes settings
app.use(require("./routes/index"));

mongoose.connect(process.env.DBURL, (err, res) => {
    if (err) {
        throw err;
    }
    console.log("DB has been connected");
});

//define port to be used
app.listen(process.env.PORT, () => {
    console.log("Listening on port 80");
});
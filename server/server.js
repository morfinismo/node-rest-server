require("./config/config");
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require("./routes/user"));

mongoose.connect(process.env.DBURL, (err, res) => {
    if (err) {
        throw err;
    }
    console.log("DB has been connected");
});

app.listen(process.env.PORT, () => {
    console.log("Listening on port 80");
});
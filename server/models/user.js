const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let validRoles = {
    values: [
        "ADMIN_ROLE",
        "USER_ROLE"
    ],
    message: "{VALUE} is not valid"
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: "USER_ROLE",
        enum: validRoles
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObj = user.toObject();
    delete userObj.password;
    return userObj;
}

userSchema.plugin(uniqueValidator, {
    message: "{PATH} must be unique"
});

module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true
    },
    description: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

categorySchema.plugin(uniqueValidator, {
    message: "{PATH} must be unique"
});

module.exports = mongoose.model("Category", categorySchema);
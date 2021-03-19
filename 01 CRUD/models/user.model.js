const mongoose = require("mongoose");

let Schema = mongoose.Schema;

//Defining Schema
let userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
});

//creatation of model
let userModel = mongoose.model("user", userSchema);

//export model
module.exports = userModel;
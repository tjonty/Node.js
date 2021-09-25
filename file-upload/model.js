//model
let Schema = mongoose.Schema;

//Defining Schema
let userSchema = new Schema({
    email: {
        type: String
    },
    photo: {
        type: String,
        default: ""
    }
});

//creatation of model
let userModel = mongoose.model("user", userSchema);

module.exports = userModel;
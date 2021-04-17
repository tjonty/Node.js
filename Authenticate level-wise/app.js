//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", (req,res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    try {     
        res.render("register");
    } catch (error) {
        res.send("error at register: " + error.message);
    }
});

app.post("/register", (req, res) => {
    try {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        })

        newUser.save((err) => {
            if(err){
                console.log(err);
            } else{
                res.render("secrets");
            }
        })
    } catch (error) {
        res.send("error at register: " + error.message);
    }
});

app.post("/login", (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({email: username}, (err, data) => {
            if(err){
                console.log(err);
            } else {
                if(data){
                    if(data.password === password){
                        res.render("secrets");
                    } else {
                        res.send("sorry");
                    }
                }
            }
        })
    } catch (error) {
        res.send("error at register: " + error.message);
    }
});

mongoose.connect("mongodb+srv://test:test@cluster0.gfcm8.mongodb.net/authenticationDB?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
}); 

const secret = "thisisourlittlesecret";

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

app.listen(3000, function () {
   console.log("Server Started"); 
});
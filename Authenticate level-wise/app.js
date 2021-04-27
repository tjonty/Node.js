//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();

// PASSPORT, COOKIE, SESSION
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

// SETTING UP SESSION
app.use(session({
    secret: process.env.secret,
    resave:  false,
    saveUninitialized: false
}));

// INITIALIZE PASSPORT
app.use(passport.initialize());
app.use(passport.session());

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
        
        User.register({ username : req.body.username}, req.body.password, (err, user) => {
            if(err) {
                console.log(err);
                res.redirect("/register");
            } else{
                passport.authenticate("local")(req, res, function(){
                    res.redirect("/secrets");
                });
            }
        });
        
    } catch (error) {
        res.send("error at register: " + error.message);
    }
});

app.get("/secrets", (req, res) => {
    if(req.isAuthenticated()){
        res.render("secrets");
    } else{
        res.redirect("/login");
    }
});

app.post("/login", (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        req.login(user, function(err) {
            if(err) {
                console.log(err); 
            } else{
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/secrets");
                });
            }
        })

    } catch (error) {
        res.send("error at register: " + error.message);
    }
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect('/');
});

mongoose.connect(process.env.db_url, { useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
}); 

// ADD PASSPORT-LOCAL-MONGOOSE TO MONGOOSE SCHEMA AS A PLUGIN
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

// PASSPORT LOCAL CONFIGURATION
 
// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(3000, function () {
   console.log("Server Started"); 
});
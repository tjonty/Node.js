const express = require("express");
const passport = require("passport");
const indexR = express.Router();
const indexC = require("../controllers/index.controllers");
const indexCAuth = require("../controllers/auth.controllers");

indexR.get("/", indexC.getMethod);
indexR.post("/register", indexC.register);
indexR.post("/login", indexCAuth.login);
indexR.get("/posts", passport.authenticate('jwt', { session: false }), indexC.posts);

  //indexR.post("/token", indexCAuth.refreshTokenF);
//indexR.delete("/logout", indexCAuth.deletetoken);

module.exports = indexR;
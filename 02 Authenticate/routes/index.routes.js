const express = require("express");
const indexR = express.Router();
const indexC = require("../controllers/index.controllers");
const indexCAuth = require("../controllers/auth.controllers");

indexR.get("/", indexC.getMethod);
indexR.post("/", indexC.register);
indexR.post("/login", indexCAuth.login);
indexR.get("/posts", indexC.authenticateToken, indexC.posts);
indexR.post("/token", indexCAuth.refreshTokenF);
indexR.delete("/logout", indexCAuth.deletetoken);

module.exports = indexR;
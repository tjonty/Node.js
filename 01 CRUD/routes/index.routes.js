const express = require("express");
const indexR = express.Router();

//import modules
const indexC = require("../controllers/index.controller");

//apis
indexR.post("/C", indexC.create);
indexR.get("/R", indexC.read);
indexR.put("/U", indexC.update);
indexR.delete("/D", indexC.deleteD);

//export modules
module.exports = indexR;
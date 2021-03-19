const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const routesA = require("./routes/index.routes");

//env
const dotenv = require("dotenv");
dotenv.config();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//call index.routes.js for all apis
app.use("/", routesA);

//connect to database
connectDB();
function connectDB() {
    mongoose.connect(process.env.db_url, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    });
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection'));
    db.once('open', function callback() {
        console.log("database connected");
    });
}

//connect to node at port
const port = process.argv[2] || process.env.port;
if (!port) {
    throw new Error("port is missing");
}
connectNode();
function connectNode() {
    app.listen(port, (req, res) => console.log("connect at " + port));   
}
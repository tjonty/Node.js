require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

//body-parser
app.use(bodyParser.urlencoded( { extended: true }));
app.use(bodyParser.json());

app.use(express.json());

//import & use Routes
const indexR = require("./routes/index.routes");
app.use("/", indexR);

//connect with database
connectDB();
function connectDB() {
  mongoose.connect(process.env.db_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  let db = mongoose.connection;
  db.on('error', console.error.bind(console, "error while connecting db"));
  db.once('open', function callback() {
      console.log("Successfully connected with Database");
  });
}


//connect at port
const port = process.argv[2] || process.env.port;
if (!port) {
  throw new Error("port is missing.");
}
listenServer();
function listenServer() {
  app.listen(port, () => {
    console.log("connected at " + port);
  });
}
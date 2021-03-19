require("dotenv").config();
const express = require("express");
const bodyParser  = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const app = express();

//model
let Schema = mongoose.Schema;

//Defining Schema
let userSchema = new Schema({
    email: {
        type: String
    },
    photo : {
        type : String,
        default : ""
    }
});

//creatation of model
let userModel = mongoose.model("user", userSchema);


//multer
const multer = require("multer");
const { throws } = require("assert");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/assest/images/banner'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null, true);
    } else{
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter : fileFilter});

//http://13.232.95.61/femalehomeworkout/asset/images/banner/1612267657.png

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//routes
app.get('/', async (req, res) => {
    try{
        await userModel.find({}, (err, docs) => {
            if (err)  throw Error(err);
            res.send(docs);
        }); 
        // fs.readFile(path.join(__dirname, '/assest/images/banner/1613364248356.jpg'), (err, data) => {
        //     res.writeHead(200, { 'Content-Type' : 'image/jpeg'});
        //     res.end(data);
        // });
    }
    catch(err){
        res.status(404).json({
            message : err.message
        });
    }
});

app.post('/upload', upload.single('image'), (req, res) => {
    try{
        if (!req.body) {
            throw new Error("body missing!");
        }
        let file_path = req.file.path;
        console.log(file_path);
        let newUser = new userModel(req.body);
        newUser.photo = file_path;
        newUser.save((err, doc) => {
            if (err) return res.send({ success: false, msg: err.message });
            res.status(200).json("Document inserted successfully." + doc);
        });
        res.status(200).json({
            message : "file upload successfully"
        });
    }
    catch(err) { 
        res.status(500).json({
            message : err.message
        });
    }
})


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

app.listen(3000, () => {
    console.log("connect at 3000.");
})
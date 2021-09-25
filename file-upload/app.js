const express = require("express");
const bodyParser  = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
require("dotenv").config();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

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

app.get("/", (req, res) =>{
    res.send("welcome to KT!");
});

//multer
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/images'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpeg'){
        cb(null, true);
    } else{
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter : fileFilter});

//routes
app.get('/file', (req, res) =>{
    res.sendFile(__dirname + '/index.html')
});

app.post('/demo', (req, res) => {
    if (!req.body) {
        throw new Error("body missing!");
    }
    res.json({
        message: "file upload successfully",
        file_name: req.body
    });
})

app.post('/upload', upload.single('image'), (req, res) => {
    try{
        if (!req.body) {
            throw new Error("body missing!");
        }
        res.json({
            message : "file upload successfully",
            file_name: req.file
        });
    }
    catch(err) { 
        res.json({
            message : err.message
        });
    }
})

app.get('/', async (req, res) => {
    try {
        await userModel.find({}, (err, docs) => {
            if (err) throw Error(err);
            res.send(docs);
        });
        // fs.readFile(path.join(__dirname, '/assest/images/banner/1613364248356.jpg'), (err, data) => {
        //     res.writeHead(200, { 'Content-Type' : 'image/jpeg'});
        //     res.end(data);
        // });
    }
    catch (err) {
        res.status(404).json({
            message: err.message
        });
    }
});
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const request = require('request');
const multer = require("multer");
const path = require("path");
const fs = require('fs');

const app = express();

dotenv.config();


app.use(bodyParser.urlencoded({ urlextended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));

app.use(express.static(path.join(__dirname + "/public")));

const filefilter = (req, res, cb) => {
    if (file.mimetype === "image/jpeg" || file, mimetype === "image/png") {
        cb(null, true)
    }
    else {
        cb(new Error("invalid file type, only JPEG and PNG is allowed "))
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "/public/image"));
    },
    filename: function (req, file, cb) {
        cb(null, "img_" + Date.now().toString() + "." + file.mimetype.split("/")[1]);
    }
}) 

const upload = multer({ filefilter: filefilter, storage: storage})


app.get("/", (req, res) => {
    try {
        res.sendFile(__dirname + "/demo.html");
    } catch (error) {
        res.send("error. : " + error);
    }
})

app.post("/upload", (req, res) => {
    try {
        fs.readdir("./public/image/", (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join("./public/image/", file), err => {
                    if (err) throw err;
                });
            }
        });
        res.redirect("/");
    } catch (error) {
        res.send("error occur in delete upload folder. : " + error);
    }
})

app.post("/download", (req, res) => {
    try {
        fs.readdir("./public/download/", (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join("./public/download/", file), err => {
                    if (err) throw err;
                });
            }
        });
        res.redirect("/");
    } catch (error) {
        res.send("error occur in delete download folder. : " + error);
    }
})

app.post('/', upload.single("image"), function (req, res, next) {
    try {
        console.log("demo: " + req.file.path);
        const api = req.body.api
        var downloadPath = Date.now() + ".png";
        request.post({
            url: 'https://api.remove.bg/v1.0/removebg',
            formData: {
                image_file: fs.createReadStream(req.file.path),
                size: 'auto',
            },
            headers: {
                'X-Api-Key': api
            },
            encoding: null
        }, function (error, response, body) {
            if (error) return console.log('Request failed:', error);
            if (response.statusCode != 200) return console.log('Error:', response.statusCode, body.toString('utf8'));
            fs.writeFileSync("./public/download/" + downloadPath, body);
            // console.log("ndvn: "+ downloadPath);
            res.render("download", { downloadPath: downloadPath });
        });
    } catch (error) {
        res.send("error occur in genrating final image. : "+ error);
    } 
})

app.listen("8080", () => {
    console.log("connected successfully.");
})


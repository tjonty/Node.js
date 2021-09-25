const express = require("express");
const app = express();
const mongoose = require("mongoose");
const shortUrl = require("./models/shortUrl");
const ShortUrl = require('./models/shortUrl');
require("dotenv").config();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    let urls = await shortUrl.find();
    res.render("index", {shortUrls : urls});
})

app.post('/shortUrls', async (req, res) => {
    let Url = {
        full: req.body.fullUrl
    }
    let newUrl = new ShortUrl({ full: req.body.fullUrl });
    newUrl.save((err, docs) => {
        if(err) return res.status(400).json('Error: ' + err.message);

        res.redirect('/');
    }) 
});

app.get("/:shortUrl", async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if(shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save();
    res.redirect(shortUrl.full);
});

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database conection established successfully.");
})

app.listen(process.env.PORT || 5550, () => {
    console.log("Server started at 5550");
})
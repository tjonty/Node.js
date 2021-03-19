//import model
const userM = require("../models/user.model");

let create = (req, res) => {
    try {
        if (!req.body) {
            throw new Error("body missing!");
        }
        let newUser = new userM(req.body);
        newUser.save((err, doc) => {
            if (err) return res.send({ success: false, msg: err.message });
            res.send("Document inserted successfully." + doc);
        });
    }
    catch (err) {
        res.send({ success: false, message: err.message });   
    }  
}

let read = async (req, res) => {
    try {
        await userM.find({}, (err, docs) => {
            if (err) return res.send({ success: false, msg: err.message });
            res.send(docs);
        }); 
    }   
    catch (err) {
        res.send({ success: false, message: err.message });
    }   
}

let update = async (req, res) => {
    try {
        if (!req.body.email || !req.body.updatename) {
            throw new Error("body or updatename missing!");
        }
        await userM.updateOne({ email: req.body.email }, { $set: { name: req.body.updatename } }, (err, docs) => {
            if (err) return res.send({ success: false, msg: err.message });
            res.send(docs);
        });
    }
    catch (err) {
        res.send({ success: false, message: err.message });
    }
} 

let deleteD = async (req, res) => {
    try { 
        if (!req.body.email) {
            throw new Error("Email missing!");
        }
        userM.deleteOne({ email: req.body.email }, (err, docs) => {
            console.log("err:"+ err + " docs: " + docs.deletedCount);
            if (err) return res.send({ success: false, msg: err.message });
            if (docs.deletedCount == 0) return res.send("successfully delete one.");
            res.send("failed to delete.");
        });   
    }
    catch (err) {
        res.send({ success: false, message: err.message });        
    }
}

//export modules
module.exports = {
    create,
    read,
    update,
    deleteD
}
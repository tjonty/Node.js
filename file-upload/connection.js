let file_path = req.file.path;
console.log(file_path);
let newUser = new userModel(req.body);
newUser.photo = file_path;
newUser.save((err, doc) => {
    if (err) return res.send({ success: false, msg: err.message });
    res.status(200).json("Document inserted successfully." + doc);
});
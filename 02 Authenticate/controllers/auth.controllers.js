const model = require("../models/user.models");
const jwt = require('jsonwebtoken');

let login = async (req, res) => {
  try {
    //check for email & password in body 
    if (!req.body.email || !req.body.password) {
      throw new Error("Email or Password is missing.");
    }
    //find user with giver email
    let user = await model.userModel.findOne({ email: req.body.email });
    //check for valid user(email exist or not)
    if (!user) {
      throw new Error("Email not found.");
    }
    //compare password with bcrypt
    let comparePassword = await user.comparePassword(req.body.password);
    //if match then send success message
    if (comparePassword) {
      var accessToken = generateToken(user.toJSON());
      var refreshToken = jwt.sign(user.toJSON(), process.env.refresh_token_secret);
      if (refreshToken) {
        const newRefreshToken = new model.tokenModel();
        newRefreshToken.token.push(refreshToken);
        let saveStatus = await newRefreshToken.save(); 
        console.log("saveStatus: "+ saveStatus);
        if (!saveStatus) {
          return res.send({msg: "error",  refreshToken: refreshToken });
        }
      }
      //var newToken = new model.tokenModel({ userid: userIdForToken, token: token });
      //await newToken.save();
      res.send({ success: true, message: "success", comparePassword: comparePassword, accesstoken: accessToken, refreshToken : refreshToken }); 
    }
    //if match not found then send fail message
    else {
    res.send({ success: false, message: "fail, enter valid password", comparePassword: comparePassword });      
    }
  }
  catch (err) {
    res.send({ success: false, msg: err.message });
  }
}
 
function generateToken(user) {
  console.log(" in generatetoken : typeof user: " + typeof user);
  console.log(" in generatetoken : user: " + user.username + user.email);
  return jwt.sign({ user }, process.env.access_token_secret, { expiresIn: '15m' });
}

let refreshTokenF = async (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    let findStatus = await model.tokenModel.find({ token: refreshToken });
    if (!findStatus.length) {
      console.log("findstatus: in if");
      return res.sendStatus(403);
    }
    jwt.verify(refreshToken, process.env.refresh_token_secret, (err, user) => {
      if (err) return res.sendStatus(403);
      console.log("type user: " + typeof user);
      console.log("user  : " + user.username);
      //{email: user.email,}
      let accessToken = generateToken(user);
      res.json({ accessToken: accessToken, msg: "sucess" });
    });  
    //{ username: user.username, email: user.email }
  }
  catch (err) {
    res.json({ msg: err.message });
  }
}

const deletetoken = async (req, res) => {
  try {
    console.log("req body token : " + req.body.token);
    let deleteStatus = await model.tokenModel.deleteOne({ token: req.body.token });
    console.log("deleteStatus : " + deleteStatus.deletedCount);
    if (!deleteStatus.deletedCount) return res.send("error in deleteion : " + deleteStatus);
    res.send({ refreshToken: deleteStatus.deletedCount });
  }
  catch (err) {
    res.send({ err: err.message });
  }
}

module.exports = {
  login,
  refreshTokenF,
  deletetoken
}
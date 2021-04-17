const model = require("../models/user.models");
const jwt = require('jsonwebtoken');

let login = async (req, res) => {
  try {
    //check for email & password in body 
    if (!req.body.email || !req.body.password) {
      throw new Error("Email or Password is missing.");
    }
    //find user with given email
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
      res.send({ success: true, message: "success", comparePassword: comparePassword, accesstoken: accessToken}); 
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
  return jwt.sign(user, process.env.access_token_secret, { expiresIn: '15m' });
}

module.exports = {
  login
}
//require('dotenv').config();
const model = require("../models/user.models");
const jwt = require('jsonwebtoken');

const postData = [
  {
    username: 'test 1',
    tite: 'post 1'
  },
  {
    username: 'test 2',
    tite: 'post 2'
  },
  {
    username: 'test 3',
    tite: 'post 3'
  },
  {
    username: 'test 4',
    tite: 'post 4'
  }
]

let getMethod = async (req, res) => {
  //fetch all user data
  let docs = await model.userModel.find();
  res.json(docs);
  let docs2 = await model.tokenModel.find();
  console.log("docs2: ="+docs2);
}

let register = async (req, res) => {
  try {
    //check for email, password, username in body
    if(!req.body.email || !req.body.password || !req.body.username){
      throw new Error("One of the body para is missing");
    }
    //search for existing user & if found send err message 
    if (await model.userModel.findOne({ email: req.body.email })) {
      throw new Error("user aleady exists.");
    }
    //create user if not exists
    let newUser = new model.userModel(req.body);
    if (await newUser.save()) {
      return res.send({ success: true, message: "success", data: newUser });
    }
    res.send({ success: false, message: "fail", data: newUser });
  }
  catch(err){
    res.send({ success: false, message: err.message });
  }
}

let login = async (req, res) => {
  try {
    //check for email & password in body 
    if (!req.body.email || !req.body.password) {
      throw new Error("Email or Password is missing.");
    }
    //find user with giver email
    let user = await model.userModel.findOne({ email: req.body.email });
    console.log(user);
    //check for valid user(email exist or not)
    if (!user) {
      throw new Error("Email not found.");
    }
    //compare password with bcrypt
    let comparePassword = await user.comparePassword(req.body.password);
    //if match then send success message
    console.log(comparePassword);
    if (comparePassword) {
      console.log(user);
      var accessToken = jwt.sign(user.toJSON(), process.env.access_token_secret);
      res.send({ success: true, message: "success", comparePassword: comparePassword, token: accessToken, user: user }); 
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

function authenticateToken(req, res, next) {
  //Bearer Token
  const authHeader = req.headers['Authorization']
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.send({ success: false, msg: "token not found." });
  jwt.verify(token, process.env.access_token_secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user.user;
    console.log("in authenticatetoken : " + req.user);
    next();
  });
}

// const posts = (req, res) => {
//   console.log("in post : " + JSON.stringify(req.user));
//   console.log("user: " + req.user.username);
//   //let user = JSON.parse(req.user);
//   res.json(postData.filter(postD => postD.username === req.user.username));
// }

const posts = (req, res) => {
  console.log("in posts");
  let token = getToken(req.headers);
  console.log("token: "+ JSON.stringify(req.user.username));
    if (token) {
        res.json(postData.filter(postD => postD.username === req.user.username));
    }
    else {
        res.send({ status: false })
    }
}

const getToken = function (headers) {
  console.log(headers);
  if (headers && headers.authorization) {
        let parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
} 


module.exports = {
  getMethod,
  register,
  login,
  authenticateToken,
  posts
}
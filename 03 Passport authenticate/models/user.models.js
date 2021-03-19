const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRound = 10;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }
}, { versionKey: false });

userSchema.pre('save', function (next) {
  let user = this;
  bcrypt.hash(user.password, saltRound, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
})

userSchema.methods.comparePassword = async function (passw) {
  let matchResult = await bcrypt.compare(passw, this.password);
  return matchResult;
}

const userModel = mongoose.model('user', userSchema);

module.exports = {
  userModel
}
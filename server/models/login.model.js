const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Login = new Schema(
  {
    sub: { type: String },
    nam: { type: String },
    prv: { type: [String] },
    svc: { type: [String] }
  },
  {
    collection: "login"
  }
);

module.exports = mongoose.model("Login", Login);

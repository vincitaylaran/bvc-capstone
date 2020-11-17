const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UrlToken = new Schema(
  {
    token: { type: String },
    iat: { type: Number }
  },
  {
    collection: "tokens"
  }
);

module.exports = mongoose.model("UrlToken", UrlToken);

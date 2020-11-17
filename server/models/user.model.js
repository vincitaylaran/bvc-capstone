const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Availability = require("./availability.model");

const User = new Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    sid: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstname: { type: String },
    lastname: { type: String },
    nickname: { type: String },
    phone: { type: String },
    status: { type: String },
    roles: { type: [mongoose.Types.ObjectId] },
    schedule: { type: [Availability] } // <-- an array of Schedule objects.
  },
  {
    collection: "users"
  }
);

module.exports = mongoose.model("User", User);

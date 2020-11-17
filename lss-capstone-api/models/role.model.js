const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Role = new Schema(
  {
    _id: { type: mongoose.Types.ObjectId },
    code: { type: String },
    description: { type: String },
    privileges: { type: [String]},
    services: { type: [Schema.Types.Mixed] }
  },
  { collection: "roles" }
);

module.exports = mongoose.model("Role", Role);

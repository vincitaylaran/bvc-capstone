const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DefaultField = new Schema(
  {
    _id: { type: String, required: true },
    code: { type: String },
    description: { type: String },
    required: { type: Boolean },
    type: { type: String },
    length: { type: Number },
    default: { type: Boolean },
    enabled: { type: Boolean },
    selections: { type: String }
  },
  {
    collection: "default_fields"
  }
);

module.exports = mongoose.model("DefaultField", DefaultField);

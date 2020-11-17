const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Field = new Schema(
  {
    code: { type: String },
    description: { type: String },
    required: { type: Boolean },
    type: { type: String },
    length: { type: Number },
    default: { type: Boolean },
    enabled: { type: Boolean },
    selections: { type: String },
  }
);

module.exports = Field;
//module.exports = mongoose.model("Field", Field);

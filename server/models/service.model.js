const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ServiceField = require("./field.model");

const Service = new Schema(
  {
    _id: { type: mongoose.Types.ObjectId },
    sid: { type: String },
    desc: { type: String },
    colour: { type: String },
    booking_type: { type: [String] },
    fields: { type: [ServiceField] }
  },
  { collection: "services" }
);

module.exports = mongoose.model("Service", Service);

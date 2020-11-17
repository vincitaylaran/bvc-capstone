const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//
// There is currently NO collection in the database for this schema.
// This schema only serves to be working with the 'User' model
// when a user creates their schedule.
const Availability = new Schema({
  _id: { type: mongoose.Types.ObjectId },
  service_sid: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  day: { type: String, required: true }
});

module.exports = Availability;

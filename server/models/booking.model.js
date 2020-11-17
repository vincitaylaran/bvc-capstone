const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Booking = new Schema(
  {
    // Service information
    service_sid: { type: String, required: true },
    book_type: { type: String, required: true }, // should be either appt (appointment) or walkin (walk-in).
    // Tutor information
    tutor_sid: { type: String },
    tutor_name: { type: String },
    // Tutee information
    tutee_name: { type: String },
    tutee_id: { type: String },
    phone: { type: String },
    email: { type: String },
    notes: { type: String },
    // Booking information
    _id: { type: mongoose.Types.ObjectId },
    date: { type: String },
    day: { type: String },
    start: { type: String },
    status: { type: String, default: "waiting" },
    book_time: { type: String }, // Time when booking is done
    status_time: { type: String }, // Time when status changed from waiting
    // Dynamic fields
    fields: { type: [Schema.Types.Mixed] }
  },
  { collection: "bookings" }
);

module.exports = mongoose.model("Booking", Booking);

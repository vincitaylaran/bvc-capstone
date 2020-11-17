const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Suggestion = new Schema(
    {
        userName: { type: String },
        email: { type: String, required: true },
        option: { type: String, require: true },
        suggestion: { type: String, require: true }
    },
    {
        collection: "suggestions"
    }
);

module.exports = mongoose.model("Suggestion", Suggestion);

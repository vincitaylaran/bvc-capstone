const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Test = new Schema(
  {
    is_test: {
      type: Boolean,
      required: true
    },
    test_description: {
      type: String
    }
  },
  { collection: "sample_collection_1" }
);

module.exports = mongoose.model("Test", Test);

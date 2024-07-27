// Feeder.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeederSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: String,
  createdDateTime: Date,
  noOfFeeder: Number,
  count: Number,
  diameter: Number,
});

module.exports = mongoose.model("Feeder", FeederSchema);

const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  id: Schema.Types.ObjectId,
  name: String,
  startTime: String,
  endTime: String,
  duration: String,
  createdDateTime: Date,
});

const Shift = mongoose.model("Shift", shiftSchema);
module.exports = Shift;

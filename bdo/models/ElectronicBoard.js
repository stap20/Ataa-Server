// ElectronicBoard.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ElectronicBoardSchema = new Schema({
  macAddr: String,
  id: Schema.Types.ObjectId,
  createdDateTime: Date,
});

module.exports = mongoose.model("ElectronicBoard", ElectronicBoardSchema);

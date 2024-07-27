// Machine.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MachineSchema = new Schema({
  name: { type: String, require: true },
  createdDateTime: Date,
  machineName: String,
  machineNumber: Number,
  id: Schema.Types.ObjectId,
  rails: Number,
  weight: Number,
  profile: { type: Schema.Types.ObjectId, ref: "MachineProfile" },
  electronicBoard: { type: Schema.Types.ObjectId, ref: "ElectronicBoard" },
});

module.exports = mongoose.model("Machine", MachineSchema);

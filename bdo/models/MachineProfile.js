// MachineProfile.js
const mongoose = require("mongoose");
const Feeder = require("./Feeder");

const Schema = mongoose.Schema;

const MachineProfileSchema = new Schema({
  id: Schema.Types.ObjectId,
  noOfneedles: Number,
  coursws: Number,
  wales: Number,
  diameters: Number,
  createdDateTime: Date,
  machineType: { type: Schema.Types.ObjectId, ref: "MachineType" },
  lfa: { type: Schema.Types.ObjectId, ref: "Lfa" },
  Feeder: { type: Schema.Types.ObjectId, ref: "Feeder" },
});

module.exports = mongoose.model("MachineProfile", MachineProfileSchema);

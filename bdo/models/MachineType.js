const mongoose = require("mongoose");

const machineTypeSchema = new mongoose.Schema({
  id: Schema.Types.ObjectId,
  name: String,
  createdDateTime: Date,
});

const MachineType = mongoose.model("MachineType", machineTypeSchema);
module.exports = MachineType;

const mongoose = require("mongoose");
// Define the Donation schema
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  machineNumber: {
    type: String,
    required: true,
  },
  machineAddress: {
    type: String,
    required: true,
  },
  ElectronicBoardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ElectronicBoard",
    required: true,
  },
});

// Create the Donation model
const Machine = mongoose.model("Machine", schema);

module.exports = Machine;

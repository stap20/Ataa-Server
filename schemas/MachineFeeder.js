const mongoose = require("mongoose");

// Define the Donation schema
const schema = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
  },
  noOfFeeder: {
    type: Number,
    required: true,
  },
  machineProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MachineProfile",
    required: true,
  },
  feederId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feeder",
    required: true,
  },
});

// Create the Donation model
const MachineFeeder = mongoose.model("MachineFeeder", schema);

module.exports = MachineFeeder;

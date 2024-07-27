const mongoose = require("mongoose");
// Define the Donation schema
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// Create the Donation model
const MachineType = mongoose.model("MachineType", schema);

module.exports = MachineType;

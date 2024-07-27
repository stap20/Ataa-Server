const mongoose = require("mongoose");
// Define the Donation schema
const schema = new mongoose.Schema({
  macAddr: {
    type: String,
    required: true,
  },
});

// Create the Donation model
const ElectronicBoard = mongoose.model("ElectronicBoard", schema);

module.exports = ElectronicBoard;

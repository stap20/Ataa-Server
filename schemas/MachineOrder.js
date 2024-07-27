const mongoose = require("mongoose");

// Define the Donation schema
const schema = new mongoose.Schema({
  machineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Machine",
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
});

// Create the Donation model
const MachineOrder = mongoose.model("MachineOrder", schema);

module.exports = MachineOrder;

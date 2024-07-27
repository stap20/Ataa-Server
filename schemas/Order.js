const mongoose = require("mongoose");

// Define the Donation schema
const schema = new mongoose.Schema({
  order_number: {
    type: String,
    require: true,
  },
  complete_weight: {
    type: Number,
    default: 0,
    unique: true,
  },
  complete_rolls: {
    type: Number,
    default: 0,
    required: true,
  },
  target_weight: {
    type: Number,
    required: true,
  },
  target_rolls: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

// Create the Donation model
const Order = mongoose.model("Order", schema);

module.exports = Order;

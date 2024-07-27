const mongoose = require("mongoose");
// Define the Donation schema
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  diameter: {
    type: Number,
    required: true,
  },
});

// Create the Donation model
const Lfa = mongoose.model("Lfa", schema);

module.exports = Lfa;

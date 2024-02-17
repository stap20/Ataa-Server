const mongoose = require("mongoose");
// Define the Donation schema
const categorySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  maxLimit: {
    type: Number,
    default: 5,
  },
  inStorage: {
    type: Number,
    default: 0,
  },
});

// Create the Donation model
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;

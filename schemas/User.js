const mongoose = require("mongoose");
// Define the Donation schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
  },
  countryCode: {
    type: String,
    default: "974",
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  profileImage: {
    type: String,
    default: null,
  },
});

// Create the Donation model
const User = mongoose.model("User", userSchema);

module.exports = User;

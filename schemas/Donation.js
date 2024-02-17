const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// Define the Donation schema
const donationSchema = new mongoose.Schema({
  donatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to Donator model
    required: true,
  },
  donationNumber: {
    type: Number,
    unique: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  isInStorage: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  imagesList: {
    type: [String],
    required: true,
  },
  donationTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Reference to Donator model
    required: true,
  },
  donationDescription: {
    type: String,
    required: true,
  },
});

// Apply the auto-increment plugin to the Donation schema
donationSchema.plugin(AutoIncrement, { inc_field: "donationNumber" });

// Create the Donation model
const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;

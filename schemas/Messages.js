const mongoose = require("mongoose");
// Define the Donation schema
const messageSchema = new mongoose.Schema({
  acceptMessage: {
    type: String,
    required: true,
  },
  rejectMessage: {
    type: String,
    required: true,
  },
  rejectStorageMessage: {
    type: String,
    required: true,
  },
});

// Create the Donation model
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;

const mongoose = require("mongoose");

// Define the Donation schema
const schema = new mongoose.Schema({
  machineProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MachineProfile",
    required: true,
  },
  lfaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lfa",
    required: true,
  },
});

// Create the Donation model
const MachineLFA = mongoose.model("MachineLFA", schema);

module.exports = MachineLFA;

const mongoose = require("mongoose");

// Define the Donation schema
const schema = new mongoose.Schema({
  profileName:{
    type:String,
    require:true,
  },
  noOfneedles: {
    type: Number,
    required: true,
  },
  coursws: {
    type: Number,
    default: 0,
    required: true,
  },
  wales: {
    type: Number,
    default: 0,
    required: true,
  },
  diameter: {
    type: Number,
    required: true,
  },

  machineTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MachineType",
    required: true,
  },

  machineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Machine",
  },
});

// Create the Donation model
const MachineProfile = mongoose.model("MachineProfile", schema);

module.exports = MachineProfile;

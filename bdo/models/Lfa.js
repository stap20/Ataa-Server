const mongoose = require("mongoose");

const lfaSchema = new mongoose.Schema({
  lfaName: String,
  description: String,
  createdDateTime: Date,
});

const Lfa = mongoose.model("Lfa", lfaSchema);
module.exports = Lfa;

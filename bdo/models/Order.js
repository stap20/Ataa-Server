const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  id: Schema.Types.ObjectId,
  complete_weight: Number,
  complete_rolls: Number,
  target_weight: Number,
  target_rolls: Number,
  startDate: Date,
  endDate: Date,
  createdDateTime: Date,
  shiftDate: Date,
  machine: { type: Schema.Types.ObjectId, ref: "Machine" },
  shift: { type: Schema.Types.ObjectId, ref: "Shift" },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Create
router.post("/", async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.status(201).send(order);
});

// Read single
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.send(order);
});

// Read all
router.get("/", async (req, res) => {
  const orders = await Order.find();
  res.send(orders);
});

// Update
router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(order);
});

// Delete
router.delete("/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;

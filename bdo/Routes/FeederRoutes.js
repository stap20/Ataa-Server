const express = require("express");
const router = express.Router();
const Feeder = require("../models/Feeder");

// Create
router.post("/", async (req, res) => {
  const feeder = new Feeder(req.body);
  await feeder.save();
  res.status(201).send(feeder);
});

// get single
router.get("/:id", async (req, res) => {
  const feeder = await Feeder.findById(req.params.id);
  res.send(feeder);
});

// Get all
router.get("/", async (req, res) => {
  const feeders = await Feeder.find();
  res.send(feeders);
});

// Update
router.put("/:id", async (req, res) => {
  const feeder = await Feeder.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(feeder);
});

// Delete
router.delete("/:id", async (req, res) => {
  await Feeder.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;

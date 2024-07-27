const express = require("express");
const router = express.Router();
const Shift = require("../models/Shift");

// Create
router.post("/", async (req, res) => {
  const shift = new Shift(req.body);
  await shift.save();
  res.status(201).send(shift);
});

// Read single
router.get("/:id", async (req, res) => {
  const shift = await Shift.findById(req.params.id);
  res.send(shift);
});

// Read all
router.get("/", async (req, res) => {
  const shifts = await Shift.find();
  res.send(shifts);
});

// Update
router.put("/:id", async (req, res) => {
  const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(shift);
});

// Delete
router.delete("/:id", async (req, res) => {
  await Shift.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;

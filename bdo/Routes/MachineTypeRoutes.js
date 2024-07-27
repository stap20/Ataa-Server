const express = require("express");
const router = express.Router();
const MachineType = require("../models/MachineType");

// Create
router.post("/", async (req, res) => {
  const machineType = new MachineType(req.body);
  await machineType.save();
  res.status(201).send(machineType);
});

// Read single
router.get("/:id", async (req, res) => {
  const machineType = await MachineType.findById(req.params.id);
  res.send(machineType);
});

// Read all
router.get("/", async (req, res) => {
  const machineTypes = await MachineType.find();
  res.send(machineTypes);
});

// Update
router.put("/:id", async (req, res) => {
  const machineType = await MachineType.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.send(machineType);
});

// Delete
router.delete("/:id", async (req, res) => {
  await MachineType.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;

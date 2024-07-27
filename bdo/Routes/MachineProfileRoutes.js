const express = require("express");
const router = express.Router();
const MachineProfile = require("../models/MachineProfile");

// Create
router.post("/", async (req, res) => {
  const machineProfile = new MachineProfile(req.body);
  await machineProfile.save();
  res.status(201).send(machineProfile);
});

// Read single
router.get("/:id", async (req, res) => {
  const machineProfile = await MachineProfile.findById(req.params.id);
  res.send(machineProfile);
});

// Read all
router.get("/", async (req, res) => {
  const machineProfiles = await MachineProfile.find();
  res.send(machineProfiles);
});

// Update
router.put("/:id", async (req, res) => {
  const machineProfile = await MachineProfile.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.send(machineProfile);
});

// Delete
router.delete("/:id", async (req, res) => {
  await MachineProfile.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Machine = require("../models/Machine");

// Create
router.post("/", async (req, res) => {
  const machine = new Machine(req.body);
  await machine.save();
  res.status(201).send(machine);
});

// Read single
router.get("/:id", async (req, res) => {
  const machine = await Machine.findById(req.params.id);
  res.send(machine);
});

// Read all
router.get("/", async (req, res) => {
  const machines = await Machine.find();
  res.send(machines);
});

// Update
router.put("/:id", async (req, res) => {
  const machine = await Machine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(machine);
});

// Delete
router.delete("/:id", async (req, res) => {
  await Machine.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;

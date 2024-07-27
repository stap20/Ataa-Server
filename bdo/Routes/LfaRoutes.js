const express = require("express");
const router = express.Router();
const Lfa = require("../models/Lfa");

// Create
router.post("/", async (req, res) => {
  const lfa = new Lfa(req.body);
  await lfa.save();
  res.status(201).send(lfa);
});

// Get single
router.get("/:id", async (req, res) => {
  const lfa = await Lfa.findById(req.params.id);
  res.send(lfa);
});

// Get all
router.get("/", async (req, res) => {
  const lfas = await Lfa.find();
  res.send(lfas);
});

// Update
router.put("/:id", async (req, res) => {
  const lfa = await Lfa.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(lfa);
});

// Delete
router.delete("/:id", async (req, res) => {
  await Lfa.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;

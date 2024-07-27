const express = require("express");
const router = express.Router();
const ElectronicBoard = require("../models/ElectronicBoard");

// Create
router.post("/", async (req, res) => {
  const electronicBoard = new ElectronicBoard(req.body);
  await electronicBoard.save();
  res.status(201).send(electronicBoard);
});

// Gett single
router.get("/:id", async (req, res) => {
  const electronicBoard = await ElectronicBoard.findById(req.params.id);
  res.send(electronicBoard);
});

// Get all
router.get("/", async (req, res) => {
  const electronicBoards = await ElectronicBoard.find();
  res.send(electronicBoards);
});

// Update
router.put("/:id", async (req, res) => {
  const electronicBoard = await ElectronicBoard.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.send(electronicBoard);
});

// Delete
router.delete("/:id", async (req, res) => {
  await ElectronicBoard.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;

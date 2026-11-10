const express = require("express");
const router = express.Router();

const {
  createCircuit,
  getCircuits,
  getCircuitById,
  updateCircuit,
  deleteCircuit,
} = require("../controllers/circuitController");

const { protect } = require("../middlewares/authMiddleware");

// Routes publiques
router.get("/", getCircuits);
router.get("/:id", getCircuitById);

// Routes administrateur
router.post("/", protect, createCircuit);
router.put("/:id", protect, updateCircuit);
router.delete("/:id", protect, deleteCircuit);

module.exports = router;

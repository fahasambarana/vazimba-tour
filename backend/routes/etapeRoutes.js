const express = require("express");
const router = express.Router();

const {
  createEtape,
  getEtapes,
  updateEtape,
  deleteEtape,
} = require("../controllers/etapeController");

const { protect } = require("../middlewares/authMiddleware");

router.get("/:circuitId", getEtapes);

router.post("/", protect, createEtape);
router.put("/:id", protect, updateEtape);
router.delete("/:id", protect, deleteEtape);

module.exports = router;

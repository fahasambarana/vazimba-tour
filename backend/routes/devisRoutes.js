const express = require("express");
const router = express.Router();

const {
  createDevis,
  getDevis,
  updateDevis,
} = require("../controllers/devisController");

const { protect } = require("../middlewares/authMiddleware");

router.post("/", createDevis);

router.get("/", protect, getDevis);

router.put("/:id", protect, updateDevis);

module.exports = router;

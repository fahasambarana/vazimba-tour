const express = require("express");
const router = express.Router();

const { login, getProfile } = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");
const { loginLimiter } = require("../middlewares/rateLimiters");

router.post("/login", loginLimiter, login);
router.get("/profile", protect, getProfile);

module.exports = router;

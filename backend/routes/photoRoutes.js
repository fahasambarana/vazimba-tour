const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");

const {
  createPhoto,
  getPhotos,
  deletePhoto,
} = require("../controllers/photoController");

const { protect } = require("../middlewares/authMiddleware");

router.get("/:hebergementId", getPhotos);

router.post("/", protect, upload.single("image"), createPhoto);

router.delete("/:id", protect, deletePhoto);

module.exports = router;

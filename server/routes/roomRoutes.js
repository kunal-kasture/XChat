const express = require("express");
const router = express.Router();
const { initRoom, getUserRooms } = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

router.post("/init", protect, initRoom);
router.get("/userrooms", protect, getUserRooms);

module.exports = router;

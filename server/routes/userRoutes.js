const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  searchUsers,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", protect, logoutUser);
router.get("/me", protect, getMyProfile);
router.get("/search", protect, searchUsers);

module.exports = router;

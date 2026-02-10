const express = require("express");
const router = express.Router();
const { signup, login, getAllUsers } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", protect, authorize("ADMIN"), getAllUsers);

module.exports = router;

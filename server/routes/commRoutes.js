const express = require("express");
const router = express.Router();
const {
  addComment,
  deleteComment,
  getComments,
} = require("../controllers/commController");
const { protect } = require("../middleware/authMiddleware");

router.route("/:postId").get(getComments).post(protect, addComment);

router.route("/:id").delete(protect, deleteComment);

module.exports = router;

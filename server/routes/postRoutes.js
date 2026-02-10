const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const {
  createPost,
  getPublicPosts,
  getPostBySlug,
  deletePost,
  getAdminPosts,
} = require("../controllers/postController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getPublicPosts);

router.get("/slug/:slug", getPostBySlug);

router.get("/admin", protect, authorize("ADMIN"), getAdminPosts);

router.post(
  "/",
  protect,
  authorize("AUTHOR", "ADMIN"),
  upload.single("image"),
  createPost,
);

router.delete("/:id", protect, deletePost);

module.exports = router;

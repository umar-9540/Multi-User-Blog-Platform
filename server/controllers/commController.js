const Comment = require("../models/Comment");
const Post = require("../models/Post");

// @desc    Add a comment
// @route   POST /api/comments/:postId
exports.addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const comment = await Comment.create({
      content,
      post: req.params.postId,
      user: req.user.id,
    });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      res.status(404);
      throw new Error("Comment not found");
    }

    const post = await Post.findById(comment.post);

    // Permission Check Logic
    const isCommentOwner = comment.user.toString() === req.user.id;
    const isPostOwner = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (isCommentOwner || isPostOwner || isAdmin) {
      await comment.deleteOne();
      res.json({ message: "Comment removed" });
    } else {
      res.status(401);
      throw new Error("Not authorized to delete this comment");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "name") // Show commenter name
      .sort({ createdAt: -1 }); // Newest first
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

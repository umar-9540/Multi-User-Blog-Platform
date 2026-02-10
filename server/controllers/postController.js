const Post = require("../models/Post");
const slugify = require("slugify");

exports.createPost = async (req, res) => {
  try {
    const { title, content, tags, status } = req.body;
    const slug = slugify(title, { lower: true });

    let imageUrl = "";
    if (req.file) {
      imageUrl = req.file.path;
    }

    const post = await Post.create({
      title,
      content,
      tags,
      status,
      slug,
      image: imageUrl,
      author: req.user.id,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPublicPosts = async (req, res) => {
  const { page = 1, limit = 10, search, tag } = req.query;
  const query = { status: "Published", isDeleted: false };

  if (search) query.$text = { $search: search };
  if (tag) query.tags = tag;

  const posts = await Post.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate("author", "name")
    .sort({ createdAt: -1 });

  res.json({ posts, total: await Post.countDocuments(query) });
};

exports.getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
      isDeleted: false,
    }).populate("author", "name email");

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  // Logic: Admin can delete any, Author only their own
  if (req.user.role !== "ADMIN" && post.author.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  post.isDeleted = true;
  await post.save();
  res.json({ message: "Post moved to trash" });
};

exports.getAdminPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ isDeleted: false })
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

const Post = require("../models/postModel");
const fs = require("fs");
const path = require("path");

// CREATE
const createPost = async (req, res) => {
  try {
    const { title, slug, content, category } = req.body;

    const post = await Post.create({
      title,
      slug,
      content,
      category,
      featuredImage: req.file ? `/uploads/images/${req.file.filename}` : "",
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL
const getAllPosts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const posts = await Post.find(filter).sort({
      position: 1,
      createdAt: -1,
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY SLUG
const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE (FIX 100%)
const updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    post.title = req.body.title || post.title;
    post.slug = req.body.slug || post.slug;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;

    // ✅ CÓ FILE → UPDATE ẢNH
    if (req.file) {
      // Xoá ảnh cũ (nếu là local)
      if (post.featuredImage && post.featuredImage.startsWith("/uploads")) {
        const oldPath = path.join(
          __dirname,
          "..",
          "public",
          post.featuredImage,
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      post.featuredImage = `/uploads/images/${req.file.filename}`;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!post)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    if (post.featuredImage?.startsWith("/uploads")) {
      const imgPath = path.join(__dirname, "..", "public", post.featuredImage);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    res.json({ message: "Đã xoá bài viết" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REORDER
const reorderPosts = async (req, res) => {
  const { orderedIds } = req.body;
  await Promise.all(
    orderedIds.map((id, index) =>
      Post.findByIdAndUpdate(id, { position: index }),
    ),
  );
  res.json({ message: "Đã cập nhật thứ tự" });
};

module.exports = {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  reorderPosts,
};

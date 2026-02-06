const Post = require("../models/postModel");
const cloudinary = require("../config/cloudinary");

// ================= CREATE =================
const createPost = async (req, res) => {
  try {
    const { title, slug, content, category } = req.body;

    const post = await Post.create({
      title,
      slug,
      content,
      category,
      featuredImage: req.file ? req.file.path : "", // ✅ URL CLOUDINARY
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ALL =================
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

// ================= GET BY SLUG =================
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

// ================= UPDATE =================
const updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    post.title = req.body.title || post.title;
    post.slug = req.body.slug || post.slug;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;

    // ✅ Có ảnh mới → xoá ảnh cũ trên Cloudinary
    if (req.file) {
      if (post.featuredImage) {
        const publicId = post.featuredImage
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];

        await cloudinary.uploader.destroy(publicId);
      }

      post.featuredImage = req.file.path; // ✅ URL CLOUDINARY
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE =================
const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!post)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    // ✅ Xoá ảnh trên Cloudinary
    if (post.featuredImage) {
      const publicId = post.featuredImage
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];

      await cloudinary.uploader.destroy(publicId);
    }

    res.json({ message: "Đã xoá bài viết" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= REORDER =================
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

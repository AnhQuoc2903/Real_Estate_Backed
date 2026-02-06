const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadCloudinary");

const {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  reorderPosts,
} = require("../controllers/postController");

// Lấy tất cả bài viết + tạo bài viết mới
router
  .route("/")
  .get(getAllPosts)
  .post(upload.single("featuredImage"), createPost);

// Sắp xếp bài viết
router.post("/reorder", reorderPosts);

// Lấy / sửa / xoá bài viết theo slug
router
  .route("/:slug")
  .get(getPostBySlug)
  .put(upload.single("featuredImage"), updatePost)
  .delete(deletePost);

module.exports = router;

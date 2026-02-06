const Post = require('../models/postModel');
const fs = require('fs');
const path = require('path');

const createPost = async (req, res) => {
    const { title, content, category, author, slug } = req.body;
    if (!title || !content || !category) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường.' });
    }
    const featuredImage = req.file ? `/uploads/images/${req.file.filename}` : '/images/news/default.png';
    try {
        const post = new Post({ title, content, category, author, featuredImage, slug });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Lỗi: Tiêu đề hoặc Slug này đã tồn tại.' });
        }
        res.status(500).json({ message: 'Lỗi server khi tạo bài viết', error: error.message });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        // SỬA LẠI "postion" -> "position"
        const posts = await Post.find(filter).sort({ position: 1, createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy bài viết', error: error.message });
    }
};

const getPostBySlug = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });
        if (!post) {
            return res.status(404).json({ message: 'Không tìm thấy bài viết' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });
        if (!post) {
            return res.status(404).json({ message: 'Không tìm thấy bài viết để cập nhật' });
        }
        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        post.category = req.body.category || post.category;
        post.author = req.body.author || post.author;
        post.slug = req.body.slug || post.slug;
        if (req.file) {
            post.featuredImage = `/uploads/images/${req.file.filename}`;
        }
        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Lỗi: Tiêu đề hoặc Slug này đã tồn tại.' });
        }
        res.status(500).json({ message: 'Lỗi server khi cập nhật', error: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ slug: req.params.slug });
        if (!post) {
            return res.status(404).json({ message: 'Không tìm thấy bài viết để xóa' });
        }
        const imagePath = path.join(__dirname, '..', 'public', post.featuredImage);
        if (post.featuredImage !== '/images/news/default.png' && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        res.status(200).json({ message: 'Đã xóa bài viết thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa', error: error.message });
    }
};

const reorderPosts = async (req, res) => {
    const { orderedIds } = req.body;
    if (!orderedIds || !Array.isArray(orderedIds)) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
    }
    try {
        const updatePromises = orderedIds.map((id, index) => 
            Post.findByIdAndUpdate(id, { position: index })
        );
        await Promise.all(updatePromises);
        res.status(200).json({ message: 'Đã cập nhật thứ tự bài viết.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostBySlug,
    updatePost,
    deletePost,
    reorderPosts // <-- THÊM HÀM NÀY VÀO EXPORT
};
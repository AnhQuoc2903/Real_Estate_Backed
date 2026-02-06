const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
    createPost,
    getAllPosts,
    getPostBySlug,
    updatePost,
    deletePost,
    reorderPosts
} = require('../controllers/postController');

// --- Cấu hình Multer để xử lý upload file ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/images/'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// THÊM DÒNG NÀY: Khởi tạo middleware của multer
const upload = multer({ storage: storage });

// --- Định nghĩa các Routes ---
router.route('/')
    .get(getAllPosts)
    .post(upload.single('featuredImage'), createPost);

router.post('/reorder', reorderPosts);

router.route('/:slug')
    .get(getPostBySlug)
    .put(upload.single('featuredImage'), updatePost)
    .delete(deletePost);

module.exports = router;
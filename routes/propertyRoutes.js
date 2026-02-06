const express = require('express');
const router = express.Router();
const {
    getAllProperties,
    createProperty,
    getPropertyById,
    updateProperty,
    deleteProperty, // 1. Đảm bảo đã import hàm này từ controller
} = require('../controllers/propertyController');

router.route('/')
    .get(getAllProperties)
    .post(createProperty);

// HÃY KIỂM TRA KỸ ĐOẠN NÀY
router.route('/:id')
    .get(getPropertyById)
    .put(updateProperty)
    .delete(deleteProperty); // <-- 2. DÒNG NÀY LÀ QUAN TRỌNG NHẤT VÀ CÓ THỂ BẠN ĐANG THIẾU

module.exports = router;
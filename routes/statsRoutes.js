const express = require('express');
const router = express.Router();
const { getStatsSummary } = require('../controllers/statsController');

// Đảm bảo đường dẫn này là chính xác
const { protect } = require('../middleware/authMiddleware');

// Áp dụng middleware vào route
router.get('/summary', protect, getStatsSummary);

module.exports = router;
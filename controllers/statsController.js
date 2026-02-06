const Post = require('../models/postModel');
const Job = require('../models/jobModel');
// Import các model khác nếu bạn muốn thống kê thêm (ví dụ: User)

/**
 * @desc   Lấy số liệu thống kê tổng quan
 * @route  GET /api/stats/summary
 * @access Private/Admin
 */
const getStatsSummary = async (req, res) => {
    try {
        // Sử dụng Promise.all để chạy các câu lệnh đếm song song, giúp tăng hiệu năng
        const [postCount, jobCount] = await Promise.all([
            Post.countDocuments(),
            Job.countDocuments(),
            // Thêm các lệnh đếm khác ở đây, ví dụ: User.countDocuments()
        ]);

        // Trả về một đối tượng JSON chứa các số liệu thống kê
        res.status(200).json({
            posts: {
                total: postCount,
            },
            jobs: {
                total: jobCount,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu thống kê.', error: error.message });
    }
};

module.exports = {
    getStatsSummary,
};
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    // Kiểm tra xem header 'Authorization' có tồn tại và bắt đầu bằng 'Bearer' không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Lấy token từ header (loại bỏ chữ 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // 2. Xác thực token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Lấy thông tin người dùng từ token và gán vào request (trừ mật khẩu)
            //    để các hàm controller sau có thể sử dụng
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Cho phép request đi tiếp
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Bạn có thể thêm middleware kiểm tra vai trò admin ở đây
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
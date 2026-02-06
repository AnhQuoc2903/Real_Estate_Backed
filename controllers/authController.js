const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Hàm tạo token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc   Đăng ký người dùng mới
// @route  POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    try {
        // Kiểm tra xem email đã tồn tại chưa
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email này đã được đăng ký.' });
        }

        // Tạo người dùng mới (mật khẩu sẽ được tự động mã hóa bởi middleware trong userModel)
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user' // Mặc định là 'user' nếu không được cung cấp
        });

        // Nếu tạo thành công, trả về thông tin user và token
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc   Đăng nhập
// @route  POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Email hoặc mật khẩu không hợp lệ' });
    }
};

module.exports = { loginUser, registerUser };
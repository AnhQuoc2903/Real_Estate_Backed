// Tải các biến môi trường từ file .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const propertyRoutes = require('./routes/propertyRoutes');
const postRoutes = require('./routes/postRoutes');
const jobRoutes = require('./routes/jobRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const statsRoutes = require('./routes/statsRoutes');
const app = express();

// Sử dụng Middlewares
app.use(cors()); // Cho phép các domain khác gọi đến API của bạn
app.use(express.json()); // Giúp express hiểu được dữ liệu JSON từ client gửi lên

// Route chính
app.get('/', (req, res) => {
    res.send('API đang chạy...');
});

// Sử dụng các routes đã định nghĩa
app.use(express.static('public')); // Để phục vụ các file tĩnh như hình ảnh
app.use('/api/properties', propertyRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes); // Đăng ký và đăng nhập người dùng
app.use('/api/stats', statsRoutes); // Thống kê tổng quan


const PORT = process.env.PORT || 5000;

// Chỉ khởi động server khi đã kết nối DB thành công
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Đã kết nối tới MongoDB!');
        app.listen(PORT, () => {
            console.log(`🚀 Server đang lắng nghe trên cổng ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error);
    }
}

startServer();
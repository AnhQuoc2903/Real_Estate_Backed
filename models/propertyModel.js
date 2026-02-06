const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Vui lòng nhập tiêu đề'] // Thêm thông báo lỗi
    },
    price: { 
        type: Number, 
        required: [true, 'Vui lòng nhập giá'] 
    },
    area: {
        type: Number,
        required: [true, 'Vui lòng nhập diện tích']
    },
    address: { 
        type: String, 
        required: [true, 'Vui lòng nhập địa chỉ'] 
    },
    description: {
        type: String,
        default: 'Chưa có mô tả'
    },
    // Bạn có thể thêm các trường khác như: soPhongNgu, soPhongTam,...
}, { 
    timestamps: true // Tự động tạo createdAt và updatedAt
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
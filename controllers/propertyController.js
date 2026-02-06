const Property = require('../models/propertyModel');

// @desc   Lấy tất cả bất động sản
// @route  GET /api/properties
// @access Public
const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find({});
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra" });
    }
};

// @desc   Tạo một bất động sản mới
// @route  POST /api/properties
// @access Private (sau này sẽ thêm xác thực)
const createProperty = async (req, res) => {
    // Lấy thông tin từ request body
    const { title, price, area, address, description } = req.body;

    if (!title || !price || !area || !address) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc' });
    }

    try {
        const property = await Property.create({
            title,
            price,
            area,
            address,
            description
        });
        res.status(201).json(property);
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra" });
    }
};

const getPropertyById = async (req, res) => {
    const { id } = req.params;
}
const updateProperty = async (req, res) => {
    const { id } = req.params;
    const { title, price, area, address, description } = req.body;

    try {
        const property = await Property.findByIdAndUpdate(id, {
            title,
            price,
            area,
            address,
            description
        }, { new: true });

        if (!property) {
            return res.status(404).json({ message: "Bất động sản không tìm thấy" });
        }

        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra" });
    }
};
const deleteProperty = async (req, res) => {
    const { id } = req.params;

    try {
        const property = await Property.findByIdAndDelete(id);

        if (!property) {
            return res.status(404).json({ message: "Bất động sản không tìm thấy" });
        }

        res.status(200).json({ message: "Bất động sản đã được xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra" });
    }
};  

module.exports = {
    getAllProperties,
    createProperty,
    getPropertyById,
    updateProperty,
    deleteProperty,
};
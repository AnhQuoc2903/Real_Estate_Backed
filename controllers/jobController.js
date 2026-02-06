const Job = require('../models/jobModel');

// @desc   Tạo một tin tuyển dụng mới
// @route  POST /api/jobs
const createJob = async (req, res) => {
    const { title, location, level, description, requirements, slug } = req.body;

    if (!title || !location || !level || !description || !requirements) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc.' });
    }

    try {
        const job = new Job({
            title,
            location,
            level,
            description,
            requirements,
            slug
        });
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Lỗi: Tiêu đề công việc này đã tồn tại.' });
        }
        res.status(500).json({ message: 'Lỗi server khi tạo tin tuyển dụng', error: error.message });
    }
};

// @desc   Lấy tất cả tin tuyển dụng
// @route  GET /api/jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({}).sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy tin tuyển dụng', error: error.message });
    }
};

// @desc   Lấy chi tiết một tin tuyển dụng theo SLUG
// @route  GET /api/jobs/:slug
const getJobBySlug = async (req, res) => {
    try {
        const job = await Job.findOne({ slug: req.params.slug });
        if (!job) {
            return res.status(404).json({ message: 'Không tìm thấy tin tuyển dụng' });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc   Cập nhật một tin tuyển dụng theo SLUG
// @route  PUT /api/jobs/:slug
const updateJob = async (req, res) => {
    try {
        const job = await Job.findOneAndUpdate({ slug: req.params.slug }, req.body, {
            new: true,
            runValidators: true
        });

        if (!job) {
            return res.status(404).json({ message: 'Không tìm thấy tin tuyển dụng để cập nhật' });
        }
        res.status(200).json(job);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Lỗi: Tiêu đề công việc này đã tồn tại.' });
        }
        res.status(500).json({ message: 'Lỗi server khi cập nhật', error: error.message });
    }
};

// @desc   Xóa một tin tuyển dụng theo SLUG
// @route  DELETE /api/jobs/:slug
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ slug: req.params.slug });
        if (!job) {
            return res.status(404).json({ message: 'Không tìm thấy tin tuyển dụng để xóa' });
        }
        res.status(200).json({ message: 'Đã xóa tin tuyển dụng thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa', error: error.message });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobBySlug,
    updateJob,
    deleteJob
};
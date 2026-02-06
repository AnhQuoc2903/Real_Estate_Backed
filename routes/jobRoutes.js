const express = require('express');
const router = express.Router();

// Import các hàm controller
const {
    createJob,
    getAllJobs,
    getJobBySlug,
    updateJob,
    deleteJob
} = require('../controllers/jobController');


// Route để lấy tất cả và tạo mới tin tuyển dụng
router.route('/')
    .get(getAllJobs)
    .post(createJob);

// Route để lấy, cập nhật, và xóa một tin tuyển dụng cụ thể
router.route('/:slug')
    .get(getJobBySlug)
    .put(updateJob)
    .delete(deleteJob);

module.exports = router;
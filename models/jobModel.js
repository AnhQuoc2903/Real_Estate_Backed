const mongoose = require('mongoose');
const slugify = require('slugify');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tiêu đề công việc là bắt buộc'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Địa điểm là bắt buộc'],
        default: 'TP. Hồ Chí Minh'
    },
    level: {
        type: String,
        required: [true, 'Cấp bậc là bắt buộc'],
        enum: ['Intern', 'Nhân viên', 'Trưởng nhóm', 'Trưởng phòng']
    },
    description: {
        type: String,
        required: [true, 'Mô tả công việc là bắt buộc']
    },
    requirements: {
        type: String,
        required: [true, 'Yêu cầu công việc là bắt buộc']
    },
    slug: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

// Middleware tự động tạo slug từ title
jobSchema.pre('save', async function (next) {
    if (this.isModified('title') || !this.slug) {
        let baseSlug = slugify(this.title, { lower: true, strict: true, locale: 'vi' });
        this.slug = baseSlug;
        // Xử lý slug trùng lặp
        let count = 1;
        while (await mongoose.models.Job.findOne({ slug: this.slug, _id: { $ne: this._id } })) {
            this.slug = `${baseSlug}-${count}`;
            count++;
        }
    }
    next();
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
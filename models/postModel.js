const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tiêu đề không được bỏ trống'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Nội dung không được bỏ trống']
    },
    author: {
        type: String,
        default: 'Admin'
    },
    category: {
        type: String,
        required: [true, 'Danh mục không được bỏ trống']
    },
    featuredImage: {
        type: String,
        default: '/images/news/default.png'
    },
    slug: {
        type: String,
        unique: true
    },
    position:{
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index để tìm kiếm slug nhanh hơn
postSchema.index({ slug: 1 });
postSchema.index({position: 1});

// Middleware tự động tạo slug
postSchema.pre('save', async function (next) {
    // Nếu người dùng có nhập slug, hãy slugify lại để đảm bảo đúng định dạng
    if (this.slug) {
        this.slug = slugify(this.slug, { lower: true, strict: true, locale: 'vi' });
    } 
    // Chỉ tạo slug nếu title thay đổi VÀ người dùng không tự nhập slug
    else if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true, locale: 'vi' });
    }

    // Xử lý trường hợp slug bị trùng (thêm số vào đuôi)
    if (this.isModified('title') || this.isModified('slug')) {
        let baseSlug = this.slug;
        let slug = this.slug;
        let count = 1;

        while (await mongoose.models.Post.findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${count}`;
            count++;
        }
        this.slug = slug;
    }
    
    next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
const nodemailer = require('nodemailer');

const sendContactEmail = async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        replyTo: email,
        to: process.env.EMAIL_USER,
        subject: `[Liên hệ từ Website] - ${subject}`,
        html: `
            <h3>Bạn có tin nhắn mới từ trang liên hệ:</h3>
            <p><strong>Tên:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Chủ đề:</strong> ${subject}</p>
            <p><strong>Nội dung:</strong></p>
            <p>${message}</p>
        `
    };

    try {
        // Gán kết quả trả về vào biến 'info'
        const info = await transporter.sendMail(mailOptions);
        
        console.log('Email sent: %s', info.messageId);
        res.status(200).json({ message: 'Tin nhắn của bạn đã được gửi thành công!' });
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        res.status(500).json({ message: 'Gửi tin nhắn thất bại. Vui lòng thử lại sau.' });
    }
};

module.exports = { sendContactEmail };
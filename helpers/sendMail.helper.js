const nodemailer = require('nodemailer');

module.exports.sendMail = (email, subject, html) => {
    const secure = SECURE == "true" ? true : false;
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
        port: 587,
        secure: secure,
        tls: {
            rejectUnauthorized: false
        }
    });

    // Define the email options
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: html,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Đã xảy ra lỗi khi gửi email:', error);
        } else {
            console.log('Email đã được gửi thành công!');
            console.log('Thông tin chi tiết:', info.response);
        }
    });
}
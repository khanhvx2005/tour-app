const AccountAdmin = require("../../models/account-admin.model")
const bcrypt = require('bcryptjs');
module.exports.login = (req, res) => {
    res.render('admin/pages/login', { titlePage: "Trang đăng nhập" })
}
module.exports.register = (req, res) => {
    res.render('admin/pages/register', { titlePage: "Trang đăng ký" })
}
// [POST] /admin/account/register
module.exports.registerPost = async (req, res) => {
    const { fullName, email, password } = req.body;
    // Tìm kiếm xem có tài khoản có email trùng trong DB hay chưa
    const exitsAccount = await AccountAdmin.findOne({
        email: email,
    })
    // Nếu tồn tại 
    if (exitsAccount) {
        res.json({
            code: "error",
            message: "Email đã tồn tại trong hệ thống!"
        })
        return; // Dừng chương trình luôn.
    }
    // Nếu chưa tồn tại thì lưu thông tin tài khoản vào DB.
    // Trước khi lưu thông tin vào CSDL cần mã hóa mật khẩu với bcryptJS
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newAccount = new AccountAdmin({
        fullName: fullName,
        email: email,
        password: hashedPassword,
        status: "initial"
    });
    await newAccount.save();

    res.json({
        code: "success",
        message: "Đăng ký tài khoản thành công!"
    })
}
module.exports.forgotPassword = (req, res) => {
    res.render('admin/pages/forgot-password', { titlePage: "Trang quên mật khẩu" })
}
module.exports.otpPassword = async (req, res) => {
    res.render("admin/pages/otp-password", {
        pageTitle: "Nhập mã OTP"
    })
}
module.exports.resetPassword = async (req, res) => {
    res.render("admin/pages/reset-password", {
        pageTitle: "Nhập mã OTP"
    })
}
module.exports.registerInitial = (req, res) => {
    res.render('admin/pages/register-initial', { titlePage: "Tài khoản được khởi tạo" })
}
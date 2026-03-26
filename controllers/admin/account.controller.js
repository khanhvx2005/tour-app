const AccountAdmin = require("../../models/account-admin.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res) => {
    res.render('admin/pages/login', { titlePage: "Trang đăng nhập" })
}
module.exports.loginPost = async (req, res) => {
    const { email, password, rememberPassword } = req.body;
    const user = await AccountAdmin.findOne({
        email: email
    });
    if (!user) {
        res.json({
            code: "error",
            message: "Email không tồn tại trong hệ thống!"
        })
        return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password); // true
    if (!isPasswordValid) {
        res.json({
            code: "error",
            message: "Sai mật khẩu!"
        })
        return;
    }
    if (user.status !== "active") {
        res.json({
            code: "error",
            message: "Tài khoản chưa được kích hoạt!"
        })
        return;
    }
    // Tạo JWT
    const token = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_SECRET, // mã hóa thông tin dựa trên chuỗi bảo mật đảm bảo ko bị lộ tt để ko bị giải mã đc
        { expiresIn: rememberPassword ? '30d' : '1d' });  // token có thời hạn 1 ngày
    res.cookie("token", token, {
        maxAge: rememberPassword ? (30 * 24 * 60 * 60 * 1000) : (24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "strict"
    })
    res.json({
        code: 'success',
        message: "Đăng nhập thành công!"
    })
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
module.exports.logoutPost = (req, res) => {
    res.clearCookie("token");
    res.json({
        code: "success",
        message: "Đăng xuất thành công!"
    })
}
const AccountAdmin = require("../../models/account-admin.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generate = require('../../helpers/generate.helper');
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHepler = require('../../helpers/sendMail.helper')
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
module.exports.forgotPasswordPost = async (req, res) => {
    const { email } = req.body;
    const exitsAccount = await AccountAdmin.findOne({
        email: email
    })
    if (!exitsAccount) {
        res.json({
            code: "error",
            message: "Email không tồn tại!"
        })
        return;
    }
    const exitsAccountInForgotPassword = await ForgotPassword.findOne({
        email: email
    })
    if (exitsAccountInForgotPassword) {
        res.json({
            code: "error",
            message: "Vui lòng gửi lại yêu cầu sau 5 phút!"
        })
        return;
    }
    const otp = generate.generateRandomNumber(6);
    const newForgotPassword = new ForgotPassword({
        email: email,
        otp: otp,
        expireAt: Date.now()

    })
    await newForgotPassword.save();
    const subject = "Mã OTP xác nhận lại mật khẩu";
    const html = `Mã OTP của bạn là: ${otp} . Mã OTP có hiệu lực trong 3 phút`;
    sendMailHepler.sendMail(email, subject, html)
    res.json({
        code: "success",
        message: "Gửi email thành công!",

    })
}
module.exports.otpPassword = async (req, res) => {
    res.render("admin/pages/otp-password", {
        pageTitle: "Nhập mã OTP"
    })
}
module.exports.otpPasswordPost = async (req, res) => {
    const { email, otp } = req.body;
    const exitsOtp = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    if (!exitsOtp) {
        res.json({
            code: "error",
            message: "Mã otp không tồn tại!"
        })
        return;
    }
    const account = await AccountAdmin.findOne({
        email: email
    });
    const token = jwt.sign({
        id: account.id,
        email: account.email,

    },
        process.env.JWT_SECRET,
        { expiresIn: '1d' });

    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict"
    })
    res.json({
        code: "success",
        message: "Gửi mã otp thành công!"
    })
}
module.exports.resetPassword = async (req, res) => {
    res.render("admin/pages/reset-password", {
        pageTitle: "Nhập mã OTP"
    })
}
module.exports.resetPasswordPost = async (req, res) => {

    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await AccountAdmin.updateOne({
        _id: req.account.id,
        status: "active",
        // deleted: false
    }, {
        password: hashedPassword
    })
    res.json({
        code: "success",
        message: "Đổi mật khẩu thành công"
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
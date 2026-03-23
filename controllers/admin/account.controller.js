module.exports.login = (req, res) => {
    res.render('admin/pages/login', { titlePage: "Trang đăng nhập" })
}
module.exports.register = (req, res) => {
    res.render('admin/pages/register', { titlePage: "Trang đăng ký" })
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
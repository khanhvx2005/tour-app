const Contact = require("../../models/contact.model");

module.exports.createPost = async (req, res) => {
    const { email } = req.body;
    const exitsEmail = await Contact.findOne({
        email: email,
        deleted: false
    })
    if (exitsEmail) {
        res.json({
            code: "error",
            message: "Email đã tồn tại trong hệ thống"
        })
        return;
    }
    const newContact = new Contact(req.body)
    await newContact.save();
    req.flash("success", "Bạn đã đăng ký tài khoản thành công !")
    res.json({
        code: "success",
    })
}
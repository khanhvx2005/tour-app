const AccountAdmin = require("../../models/account-admin.model");
const jwt = require('jsonwebtoken');

module.exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.redirect(`/${pathAdmin}/account/login`)
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // giải mã token
        const { id, email } = decoded;
        const exitsAccount = await AccountAdmin.findOne({
            _id: id,
            email: email,
            status: "active"
        })
        if (!exitsAccount) {
            res.clearCookie("token")
            res.redirect(`/${pathAdmin}/account/login`)
            return;
        }

        next();
    } catch (error) {
        res.clearCookie("token")
        res.redirect(`/${pathAdmin}/account/login`)
    }
}
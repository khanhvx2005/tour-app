const AccountAdmin = require("../../models/account-admin.model");
const jwt = require('jsonwebtoken');
const Role = require('../../models/role.model')
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
        const infoRole = await Role.findOne({
            _id: exitsAccount.role
        })
        if (infoRole) {
            res.locals.role = infoRole;
        }
        req.permissions = infoRole.permissions;
        req.account = exitsAccount;
        res.locals.account = exitsAccount;
        res.locals.permissions = infoRole.permissions;
        next();
    } catch (error) {
        res.clearCookie("token")
        res.redirect(`/${pathAdmin}/account/login`)
    }
}
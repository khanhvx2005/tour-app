module.exports.list = async (req, res) => {

    res.render("admin/pages/order-list", {
        pageTitle: "Quản lý đơn hàng",
    })
}
module.exports.edit = async (req, res) => {

    res.render("admin/pages/order-edit", {
        pageTitle: "Chỉnh sửa đơn hàng",
    })
}
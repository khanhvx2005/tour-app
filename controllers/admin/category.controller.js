module.exports.list = async (req, res) => {
    res.render("admin/pages/category-list", {
        pageTitle: "Trang danh sách danh mục"
    })
}
module.exports.create = async (req, res) => {
    res.render("admin/pages/category-create", {
        pageTitle: "Trang tạo danh mục"
    })
}
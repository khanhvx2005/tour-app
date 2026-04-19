const Category = require("../../models/category.model");
const Tour = require("../../models/tour.model");
const categoryHelper = require('../../helpers/category.helper')
const moment = require('moment');
const City = require("../../models/city.model");
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slug;
        const tourDetail = await Tour.findOne({
            slug: slug,
            deleted: false,
            status: "active"
        })
        if (!tourDetail) {
            res.redirect('/')
            return;
        }
        // Truyền dữ liệu ra khối Breadcrumb
        const breadcrumb = {
            title: tourDetail.name,
            images: tourDetail.avatar,
            list: [
                {
                    title: "Trang chủ",
                    link: "/"
                }
            ]
        }
        // Tìm danh mục của tour hiện tại
        if (tourDetail.category) {
            const category = await Category.findOne({
                _id: tourDetail.category,
                deleted: false,
                status: "active"
            })
            if (category) {

                const listCategory = await categoryHelper.getCategoryParent(category.parent)
                listCategory.forEach((item) => {
                    breadcrumb.list.push({
                        title: item.name,
                        link: `/category/${item.slug}`
                    })
                })
                breadcrumb.list.push({
                    title: category.name,
                    link: `/category/${category.slug}`
                })
            }

        }
        breadcrumb.list.push({
            title: tourDetail.name,
            link: `/tour/detail/${tourDetail.slug}`
        })
        // End Breadcrumb


        tourDetail.departureDateFormat = moment(tourDetail.departureDate).format("DD/MM/YYYY")
        // Lấy danh sách những thành phố có trong Tour
        const cityList = await City.find({
            _id: { $in: tourDetail.locations },
        })
        res.render("client/pages/tour-detail.pug", {
            pageTitle: tourDetail.name,
            tourDetail: tourDetail,
            breadcrumb: breadcrumb,
            cityList: cityList
        })
    } catch (error) {
        console.log("Có lỗi tại trang chi tiết tour", error)
        res.redirect('/')
    }
}
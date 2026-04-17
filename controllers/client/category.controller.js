const Category = require('../../models/category.model');
const Tour = require('../../models/tour.model');
const City = require('../../models/city.model')
const categoryHelper = require('../../helpers/category.helper')
const moment = require('moment')
module.exports.list = async (req, res) => {
    const slug = req.params.slug;
    const categoryDetail = await Category.findOne({
        slug: slug,
        deleted: false,
        status: "active"
    })
    // Nếu slug không tồn tại sẽ chuyển hướng về trang chủ
    if (categoryDetail) {
        // breadcrumb
        const breadcrumb = {
            images: categoryDetail.avatar,
            title: categoryDetail.name,
            list: [
                {
                    link: "/",
                    title: "Trang chủ"
                },
            ]
        }
        // Tìm danh mục cha của danh mục hiện tại
        if (categoryDetail.parent) {
            const parentCategory = await Category.findOne({
                _id: categoryDetail.parent,
                deleted: false,
                status: "active"
            })
            if (parentCategory) {
                breadcrumb.list.push({
                    link: `/category/${parentCategory.slug}`,
                    title: parentCategory.name
                })
            }

        }
        // Thêm danh mục hiện tại
        breadcrumb.list.push({
            link: `/category/${categoryDetail.slug}`,
            title: categoryDetail.name
        })
        // End breadcrumb

        // Danh sách Tour
        const listCategory = await categoryHelper.getCategory(categoryDetail.id)
        const listCategoryId = listCategory.map((item) => item.id)
        listCategoryId.push(categoryDetail.id)
        const find = {
            category: { $in: listCategoryId },
            deleted: false,
            status: "active"
        }
        const totalTour = await Tour.countDocuments(find)
        const tourList = await Tour
            .find(find)
            .sort({
                position: 'desc'
            })
            .limit(6)
        for (const item of tourList) {
            item.discount = (((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100).toFixed();
            item.departureDateFormat = moment(item.departureDate).format('DD/MM/YYYY');
        }

        // End Danh sách Tour
        const cityList = await City.find({})
        res.render('client/pages/tour-list', {
            pageTitle: "Danh sách tour",
            categoryDetail: categoryDetail,
            tourList: tourList,
            breadcrumb: breadcrumb,
            cityList: cityList,
            totalTour: totalTour
        })
    } else {
        res.redirect(`/`)
    }

}
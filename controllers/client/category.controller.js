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
            status: "active",
        }
        const sort = {
        }
        // Phân trang
        const limitItems = 6;
        const totalRecords = await Tour.countDocuments(find)
        const totalPage = Math.ceil(totalRecords / limitItems)
        let currentPage = 1;
        if (req.query.page && req.query.page > 0) {
            currentPage = parseInt(req.query.page)
        }
        if (currentPage > totalPage && totalPage > 0) {
            currentPage = totalPage;
        }
        const skip = (currentPage - 1) * limitItems;
        const pagination = {
            totalPage: totalPage,
            currentPage: currentPage
        }
        // End phân trang
        // Sắp xếp giá
        if (req.query.sortPrice) {
            const [key, value] = req.query.sortPrice.split("-");
            sort[key] = value;
        } else {
            sort.position = "desc";
        }
        // End sắp xếp giá
        const totalTour = await Tour.countDocuments(find)
        const tourList = await Tour
            .find(find)
            .sort(sort)
            .limit(limitItems)
            .skip(skip)
        for (const item of tourList) {
            item.discount = (((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100).toFixed();
            item.departureDateFormat = moment(item.departureDate).format('DD/MM/YYYY');
        }

        // End Danh sách Tour
        // Danh sách thành phố
        const cityList = await City.find({})
        // End Danh sách thành phố

        res.render('client/pages/tour-list', {
            pageTitle: categoryDetail.name,
            categoryDetail: categoryDetail,
            tourList: tourList,
            breadcrumb: breadcrumb,
            cityList: cityList,
            totalTour: totalTour,
            pagination: pagination
        })
    } else {
        res.redirect(`/`)
    }

}
const Category = require("../../models/category.model")
const categoryHelper = require('../../helpers/category.helper')
const City = require("../../models/city.model")
const Tour = require('../../models/tour.model')
const AccountAdmin = require('../../models/account-admin.model')
const moment = require('moment')
const slugify = require('slugify')
module.exports.list = async (req, res) => {
    try {
        const find = {
            deleted: false
        }
        // Bộ lọc trạng thái và người tạo
        if (req.query.status) find.status = req.query.status;
        if (req.query.createdBy) find.createdBy = req.query.createdBy;
        // End Bộ lọc trạng thái và người tạo

        // Bộ lọc theo thời gian tạo
        const dataFilterDate = {};
        if (req.query.startDate) {
            const startDate = moment(req.query.startDate).startOf('day').toDate();
            dataFilterDate['$gte'] = startDate;
        }
        if (req.query.endDate) {
            const endDate = moment(req.query.endDate).endOf('day').toDate();
            dataFilterDate['$lte'] = endDate;
        }
        if (Object.keys(dataFilterDate).length > 0) {
            find.createdAt = dataFilterDate;
        }
        // End Bộ lọc theo thời gian tạo

        // Bộ lọc theo danh mục
        if (req.query.category) {
            find.category = req.query.category;
        }
        // End Bộ lọc theo danh mục

        // Bộ lọc theo mức giá

        if (req.query.price) {
            const price = req.query.price.split('-');
            if (price.length === 2) {
                const minPrice = parseInt(price[0]);
                const maxPrice = parseInt(price[1]);
                if (!isNaN(minPrice) && !isNaN(maxPrice)) {
                    find.priceNewAdult = {
                        $gte: minPrice,
                        $lte: maxPrice
                    };
                }

            }
        }

        // End Bộ lọc theo mức giá

        // Pagination
        const totalRecords = await Tour.countDocuments(find);
        const limitItems = 4;
        const totalPage = Math.ceil(totalRecords / limitItems)

        let currentPage = 1;
        if (req.query.page && req.query.page > 0) {
            currentPage = req.query.page;
        }
        if (currentPage > totalPage && totalPage > 0) {
            currentPage = totalPage;
        }
        const skip = (currentPage - 1) * limitItems;
        const pagination = {
            totalPage: totalPage,
            totalRecords: totalRecords,
            start: skip + 1,
            end: Math.min((skip + limitItems), totalRecords)
        }
        // End Pagination
        // Tìm kiếm
        if (req.query.keyword) {
            const slug = slugify(req.query.keyword, {
                lower: true,
                strict: true,
                trim: true
            })
            const regexSlug = new RegExp(slug, "i")
            find.slug = regexSlug;
        }
        // End tìm kiếm
        // Lấy danh sách danh mục 
        const categoryList = await Category.find({ deleted: false })
        const newCategoryList = categoryHelper.buildCategoryTree(categoryList);
        const tourList = await Tour
            .find(find)
            .sort({
                position: 'desc'
            })
            .limit(limitItems)
            .skip(skip)
        for (const item of tourList) {
            if (item.createdBy) {
                const infoAccountCreated = await AccountAdmin.findOne({
                    _id: item.createdBy
                })
                if (infoAccountCreated) item.createdByFullname = infoAccountCreated.fullName;

            }
            if (item.updatedBy) {
                const infoAccountUpdated = await AccountAdmin.findOne({
                    _id: item.updatedBy
                })
                if (infoAccountUpdated) item.updatedByFullname = infoAccountUpdated.fullName;

            }
            item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY")
            item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY")
        }
        const accountAdminList = await AccountAdmin.find({}, 'fullName')
        res.render("admin/pages/tour-list", {
            pageTitle: "Trang danh sách tour",
            tourList: tourList,
            accountAdminList: accountAdminList,
            categoryList: newCategoryList,
            pagination: pagination
        })
    } catch (error) {
        console.log("Lỗi tại controller list", error);
    }
}
module.exports.create = async (req, res) => {
    try {
        const categoryList = await Category.find({
            deleted: false
        })
        const newCategoryList = categoryHelper.buildCategoryTree(categoryList);
        const cityList = await City.find({});
        res.render("admin/pages/tour-create", {
            pageTitle: "Tạo tour",
            categoryList: newCategoryList,
            cityList: cityList
        })
    } catch (error) {
        console.log("Có lỗi controller create", "error")
    }

}
module.exports.trash = async (req, res) => {
    const find = {
        deleted: true
    }
    if (req.query.keyword) {
        const slug = slugify(req.query.keyword, {
            lower: true,
            strict: true,
            trim: true
        })
        const regexSlug = new RegExp(slug, "i")
        find.slug = regexSlug;
    }
    const limitItems = 4;
    const totalRecords = await Tour.countDocuments(find)
    const totalPage = Math.ceil(totalRecords / limitItems);
    const currentPage = 1;
    if (req.query.page && req.query.page > 0) {
        currentPage = parseInt(req.query.page)
    }
    if (currentPage > totalPage && totalPage > 0) {
        currentPage = totalPage;
    }
    const skip = (currentPage - 1) * limitItems;
    const pagination = {
        totalRecords: totalRecords,
        totalPage: totalPage,
        start: skip + 1,
        end: Math.min(skip + 1, totalRecords)
    }
    if (totalRecords === 0) {
        pagination.start = 0;
    }
    const tourListDeleted = await Tour
        .find(find)
        .sort({
            position: 'desc'
        })
        .limit(limitItems)
        .skip(skip)
    for (const item of tourListDeleted) {
        if (item.createdBy) {
            const infoAccountCreated = await AccountAdmin.findOne({
                _id: item.createdBy
            })
            item.createdByFullname = infoAccountCreated.fullName;
        }
        if (item.deletedBy) {
            const infoAccountDeleted = await AccountAdmin.findOne({
                _id: item.deletedBy
            })
            item.deletedByFullname = infoAccountDeleted.fullName;
        }
        item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY")
        item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YYYY")

    }
    res.render("admin/pages/tour-trash", {
        pageTitle: "Thùng rác tour",
        tourListDeleted: tourListDeleted,
        pagination: pagination

    })
}
module.exports.createPost = async (req, res) => {
    if (!req.permissions.includes("tour_create")) {
        res.json({
            code: "error",
            message: "Bạn không có quyền sử dụng tính năng này!"
        })
        return;
    }
    if (!req.body.position) {
        const count = await Tour.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];
    req.body.avatar = req.file ? req.file.path : "";
    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    const newTour = new Tour(req.body);
    await newTour.save();
    req.flash("success", "Tạo tour thành công!")
    res.json({
        code: "success",
    })
}
module.exports.changeMultiPatch = async (req, res) => {


    try {
        const { ids, status } = req.body;
        switch (status) {
            case "active":
                if (!req.permissions.includes("tour_edit")) {
                    res.json({
                        code: "error",
                        message: "Bạn không có quyền sử dụng tính năng này!"
                    })
                    return;
                }
                await Tour.updateMany({
                    _id: { $in: ids }
                },
                    {
                        status: status,
                        updatedBy: req.account.id,
                    })
                req.flash('success', "Đổi trạng thái thành công!")
                break;
            case "inactive":
                if (!req.permissions.includes("tour_edit")) {
                    res.json({
                        code: "error",
                        message: "Bạn không có quyền sử dụng tính năng này!"
                    })
                    return;
                }
                await Tour.updateMany({
                    _id: { $in: ids }
                },
                    {
                        status: status,
                        updatedBy: req.account.id,
                    })
                req.flash('success', "Đổi trạng thái thành công!")
                break;
            case "delete":
                if (!req.permissions.includes("tour_delete")) {
                    res.json({
                        code: "error",
                        message: "Bạn không có quyền sử dụng tính năng này!"
                    })
                    return;
                }
                await Tour.updateMany({
                    _id: { $in: ids }
                },
                    {
                        deleted: true,
                        deletedBy: req.account.id,
                        deletedAt: Date.now()
                    })
                req.flash('success', "Xóa thành công!")
                break;

            default:
                break;
        }

        res.json({
            code: "success",
        })
    } catch (error) {
        console.log("Có lỗi trong controller changeMultiPatch", error)
    }
}
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const tourDetail = await Tour.findOne({
            _id: id
        })

        if (tourDetail) {
            tourDetail.departureDateFormat = moment(tourDetail.departureDate).format("YYYY-MM-DD")
            const cityList = await City.find({})
            const categoryList = await Category.find({
                deleted: false
            })
            const newCategoryList = categoryHelper.buildCategoryTree(categoryList)
            res.render('admin/pages/tour-edit', { pageTitle: "Trang chỉnh sửa tour", tourDetail: tourDetail, cityList: cityList, categoryList: newCategoryList })
        } else {
            res.redirect(`/${pathAdmin}/tour/list`)

        }

    } catch (error) {
        console.log("Lỗi controller edit", error)
        res.redirect(`/${pathAdmin}/tour/list`)
    }
}
module.exports.editPatch = async (req, res) => {
    if (!req.permissions.includes("tour_edit")) {
        res.json({
            code: "error",
            message: "Bạn không có quyền sử dụng tính năng này!"
        })
        return;
    }
    try {
        const id = req.params.id;
        if (!req.body.position) {
            const count = await Tour.countDocuments({})
            req.body.position = count + 1;
        } else {
            req.body.position = parseInt(req.body.position)
        }
        if (req.file) {
            req.body.avatar = req.file.path;
        } else {
            delete req.body.avatar;
        }
        req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
        req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;

        req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
        req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
        req.body.priceNewChildren = req.body.priceBaby ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
        req.body.priceNewBaby = req.body.priceBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
        req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
        req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0;
        req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
        req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
        req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
        req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];
        req.body.updatedBy = req.account.id;
        await Tour.updateOne({
            _id: id
        }, req.body)
        req.flash("success", "Cập nhập thành công!")
        res.json({
            code: "success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không hợp lệ"
        })
    }

}
module.exports.deletePatch = async (req, res) => {
    if (!req.permissions.includes("tour_delete")) {
        res.json({
            code: "error",
            message: "Bạn không có quyền sử dụng tính năng này!"
        })
        return;
    }
    try {
        const id = req.params.id;
        await Tour.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedBy: req.account.id,
            deletedAt: Date.now()
        })
        req.flash("success", "Xóa thành công")
        res.json({
            code: "success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không hợp lệ"
        })
    }
}
module.exports.undoPatch = async (req, res) => {
    if (!req.permissions.includes("tour_trash")) {
        res.json({
            code: "error",
            message: "Bạn không có quyền sử dụng tính năng này!"
        })
        return;
    }
    try {
        const id = req.params.id;
        await Tour.updateOne({
            _id: id
        }, {
            deleted: false,
        })
        req.flash("success", "Khôi phục thành công")
        res.json({
            code: "success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không hợp lệ"
        })
    }

}
module.exports.deleteDestroyPatch = async (req, res) => {
    if (!req.permissions.includes("tour_trash")) {
        res.json({
            code: "error",
            message: "Bạn không có quyền sử dụng tính năng này!"
        })
        return;
    }
    try {
        const id = req.params.id;
        await Tour.deleteOne({
            _id: id
        })
        req.flash("success", "Xóa vĩnh viễn thành công")
        res.json({
            code: "success",

        })
    } catch (error) {
        res.json({
            code: "success",
            message: "Id không hợp lệ!"
        })
    }
}
module.exports.trashChangeMultiPatch = async (req, res) => {
    try {
        const { ids, status } = req.body;
        switch (status) {
            case 'undo':
                await Tour.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: false
                })
                req.flash("success", "Khôi phục thành công!")
                break;
            case 'delete-destroy':
                await Tour.deleteOne({
                    _id: { $in: ids }
                })
                req.flash("success", "Xóa vĩnh viễn tour thành công!")
                break;
            default:
                break;
        }
        res.json({
            code: "success",
            message: "Thành công!"

        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không hợp lệ"
        })
    }

}
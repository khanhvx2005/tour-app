const Category = require('../models/category.model')
const buildCategoryTree = (arr, parentId = "") => {
    const tree = [];
    arr.forEach(item => {
        if (item.parent === parentId) {
            const newItem = item;
            const children = buildCategoryTree(arr, item.id)
            if (children.length > 0) {
                newItem.children = children;
            }
            tree.push(newItem)

        }

    });
    return tree;
}
module.exports.buildCategoryTree = buildCategoryTree;
const getSubCategory = async (category) => {
    const subs = await Category.find({
        parent: category,
        deleted: false,
        status: "active"
    })
    let allSubs = [...subs];
    for (const sub of subs) {
        const childs = await getSubCategory(sub.id)
        allSubs = allSubs.concat(childs)
    }
    return allSubs;
}
module.exports.getCategory = async (category) => {
    const result = await getSubCategory(category)
    return result;
}
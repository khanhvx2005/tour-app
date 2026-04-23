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
// Hàm lấy danh sách danh mục con , cháu , chắt
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
// End  Hàm lấy danh sách danh mục con , cháu , chắt

// Hàm lấy danh sách danh mục cha , ông cụ
const getParentCategory = async (category) => {
  const parents = await Category.find({
    _id: category,
    deleted: false,
    status: "active"
  })
  let allParents = [...parents];
  for (const parent of parents) {
    if (parent.parent) {
      const pts = await getParentCategory(parent.parent)
      allParents = allParents.concat(pts)
    }

  }
  return allParents.reverse();
}
module.exports.getCategoryParent = async (category) => {
  const result = await getParentCategory(category)
  return result;
}
// End Hàm lấy danh sách danh mục cha , ông cụ

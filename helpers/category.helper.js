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
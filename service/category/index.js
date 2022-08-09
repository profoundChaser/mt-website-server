const CategoryMap = require('../../db/models/Category/mapper')

module.exports = {
  //获取所有图片分类
  getAllCategories: async function (params) {
    let res
    const categories = await CategoryMap.getAllCategories(params)
    if (categories.count) {
      return (res = {
        status: 200,
        data: categories,
        msg: '获取分类成功',
      })
    } else {
      return (res = {
        status: 400,
        msg: '获取分类失败',
      })
    }
  },
  addCategory: async function (Category) {
    let res = null
    const CategoryRes = await CategoryMap.createCategory(Category)
    if (objectISEmpty(CategoryRes)) {
      return (res = {
        status: 200,
        msg: '添加图片分类成功',
        data: CategoryRes,
      })
    } else {
      return (res = {
        status: 400,
        msg: '添加图片分类失败',
      })
    }
  },
  updateCategory: async function (id, Category) {
    let res = null
    const CategoryRes = await CategoryMap.updateCategory(id, Category, CategoryMap)
    if (objectISEmpty(CategoryRes)) {
      return (res = {
        status: 200,
        msg: '修改图片分类成功',
        data: CategoryRes,
      })
    } else {
      return (res = {
        status: 400,
        msg: '修改图片分类失败',
      })
    }
  },
  deleteCategory: async function (id) {
    let res = null
    const CategoryRes = await CategoryMap.deleteCategory(id, CategoryMap)
    if (objectISEmpty(CategoryRes)) {
      return (res = {
        status: 200,
        msg: '删除图片分类成功',
        data: CategoryRes,
      })
    } else {
      return (res = {
        status: 400,
        msg: '删除图片分类失败',
      })
    }
  },
  deleteCategories: async function (idList) {
    let res = null
    for (let i = 0; i < idList.length; i++) {
      const CategoryRes = await CategoryMap.deleteUser(idList[i], CategoryMap)
      if (i === idList.length - 1) {
        return (res = {
          msg: '删除这些图片分类成功',
          status: 200,
        })
      }
    }
  },
}

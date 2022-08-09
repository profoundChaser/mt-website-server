const Category = require('./index.js')
const { Op } = require('sequelize')

const CategoryMap = {
  getAllCategories: async (params) => {
    let pageInfo = {}
    if (params) {
      //请求是否携带分页逻辑
      if (params.pageSize) {
        pageSize = params.pageSize
        pageIndex = params.pageIndex
        pageInfo = {
          limit: +pageSize,
          offset: (pageIndex - 1) * +pageSize,
        }
      }
    }
    const categoryObj = await Category.findAndCountAll({})

    const categories = await Category.findAll({
      ...pageInfo,
    })
    return { categories, count: categoryObj.count }
  },
  getCategoryById: async (id) => {
    return Category.findByPk(id)
  },
  getCategoryByName: async (name) => {
    return Category.findAll({
      where: {
        name: {
          [Op.like]: `${name}%`,
        },
      },
    })
  },
  getCategoryByNameInEn: async (nameInEn) => {
    return Category.findAll({
      where: {
        nameInEn: {
          [Op.like]: `${email}%`,
        },
      },
    })
  },
  updateCategory: async (id, category, Category) => {
    const item = await Category.getCategoryById(id)
    if (item) {
      return item.update(category)
    } else {
      throw new Error(`the customer with id ${id} is not exist`)
    }
  },
  createCategory: async (category) => {
    return Category.create(category)
  },
  deleteCategory: async (id, Category) => {
    const category = await Category.getCategoryById(id)
    if (category) {
      return category.destroy()
    }
  },
}

module.exports = CategoryMap

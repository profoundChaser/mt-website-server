const Category = require('./index.js')
const { Op } = require('sequelize')

const CategoryMap = {
  getAllCategories: async () => {
    return Category.findAndCountAll()
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

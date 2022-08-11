const Image = require('./index.js')
const { Op } = require('sequelize')
const UserMap = require('../User/mapper')
const { objectISEmpty } = require('../../../utils/utils.js')
const ImageMap = {
  getAllImages: async (pageInfo,where) => {
    console.log(where)
    //整合
    return  Image.findAll({
      attributes: [
        'id',
        'name',
        'imgUrl',
        'uploaderId',
        'categoryId',
        'downloads',
        'views',
        'createdAt'
      ],
      ...pageInfo,
      where: where,
    })
  },
  getImageAndCountAll: async (where) => {
    return Image.findAndCountAll({ where })
  },
  getImageById: async (id) => {
    return Image.findByPk(id)
  },
  updateImage: async (id, image, Image) => {
    const item = await Image.getImageById(id)
    if (item) {
      return item.update(image)
    } else {
      throw new Error(`the customer with id ${id} is not exist`)
    }
  },
  createImage: async (image) => {
    return Image.create(image)
  },
  deleteImage: async (id, Image) => {
    const image = await Image.getImageById(id)
    if (image) {
      return image.destroy()
    }
  },
}

module.exports = ImageMap

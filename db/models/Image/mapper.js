const Image = require('./index.js')
const { Op } = require('sequelize')

const ImageMap = {
  getAllImages: async () => {
    const imageCountObj = await Image.findAndCountAll({
      attributes: [
        'id',
        'name',
        'imgUrl',
        'uploaderId',
        'categoryId',
        'downloads',
        'views',
      ],
    })
    let imgsArr = []

    for (let i = 0; i < imageCountObj.rows.length; i++) {
      const item = imageCountObj.rows[i]
      const user = await item.getUser()
      const category = await item.getImgCategory()
      imgsArr.push({
        id: item.id,
        imgName: item.name,
        imgUrl: item.imgUrl,
        uploader: user.name,
        downloads: item.downloads,
        views: item.views,
        avatar: user.avatar,
        category_name: category.name,
        category_nameInEn: category.nameInEn,
      })
    }
    return imgsArr
  },
  getImageById: async (id) => {
    return Image.findByPk(id)
  },
  updateImage: async (id, image, Image) => {
    const item = await Image.getUserById(id)
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

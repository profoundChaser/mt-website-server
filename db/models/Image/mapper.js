const Image = require('./index.js')
const { Op } = require('sequelize')
const UserMap = require('../User/mapper')
const ImageMap = {
  getAllImages: async (params) => {
    let pageInfo = {}
    let count = 0
    let where = {}
    //请求是否携带分页逻辑
    if (params.pageSize) {
      pageSize = params.pageSize
      pageIndex = params.pageIndex
      pageInfo = {
        limit: +pageSize,
        offset: (pageIndex - 1) * +pageSize,
      }
    }
    //请求是否携带查询逻辑
    if (params.searchContent) {
      let user = null
      const { imgName, name, categoryId } = JSON.parse(params.searchContent)
      console.log(imgName, name, categoryId)
      if (imgName) {
        where.name = {
          [Op.like]: `%${imgName}%`,
        }
      }
      if (name) {
        //获取用户对象
        user = await UserMap.getUserByName(name)
        where.uploaderId = user.id
      }
      if (categoryId) {
        where.categoryId = categoryId
      }
      //按条件获取长度
      const imageObj = await Image.findAndCountAll({
        where
      })
      count = imageObj.count
    }
    //整合
    const images = await Image.findAll({
      attributes: [
        'id',
        'name',
        'imgUrl',
        'uploaderId',
        'categoryId',
        'downloads',
        'views',
      ],
      ...pageInfo,
      where: where,
    })
    let imgsArr = []
    //联表处理数据结果
    for (let i = 0; i < images.length; i++) {
      const item = images[i]
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
    return { imgsArr, count }
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

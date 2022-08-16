const ImageMap = require('../../db/models/Image/mapper')
const {
  uploadToQINIU,
  QINIUDeleteFile,
  QINIUDeleteFiles,
} = require('../../utils/qiniu')
const QINIU = require('../../config/qiniuConfig')
const qiniu = require('qiniu')
const { Op } = require('sequelize')
const UserMap = require('../../db/models/User/mapper')
const sequelize = require('../../db/index.js')
const {
  createRandomNumWidthScope,
  objectISEmpty,
} = require('../../utils/utils')
module.exports = {
  //获取所有图片分类
  getAllImages: async function (params) {
    let res = null
    let pageInfo = {}
    let count = 0
    let where = {}
    let order = null
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
      //请求是否携带查询逻辑
      if (params.searchContent) {
        let user = null
        const { imgName, name, categoryId } = JSON.parse(params.searchContent)
        if (imgName) {
          where.name = {
            [Op.like]: `%${imgName}%`,
          }
        }
        if (name) {
          //获取用户对象
          user = await UserMap.getUserByName(name)
          if (user) {
            where.uploaderId = user.id
          }
        }
        if (categoryId) {
          where.categoryId = categoryId
        }
        //按条件获取长度
        const imageObj = await ImageMap.getImageAndCountAll(where)
        count = imageObj.count
      }

      if (params.useRandom) {
        order = sequelize.random()
      }
    }
    const images = await ImageMap.getAllImages(pageInfo, where, order)
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
        tags: item.tags !== null ? item.tags.split(' ') : null,
        category_name: category.name,
        category_nameInEn: category.nameInEn,
      })
    }

    if (images) {
      return (res = {
        status: 200,
        data: { imgsArr, count },
        msg: '获取图片成功',
      })
    } else {
      return (res = {
        status: 400,
        msg: '获取图片失败',
      })
    }
  },
  uploadImages: async function (images, files, imageObj) {
    let res
    let qiniuRes
    //七牛云生成文件夹和指定文件夹
    const dirName = imageObj.categoryPath
    //写入到数据库，做单文件和多文件判断
    if (images.length === 1) {
      qiniuRes = await uploadToQINIU(images[0].uid, files, dirName)
      const imageOptions = {
        id: images[0].uid,
        name: imageObj.name,
        categoryId: imageObj.categoryId,
        uploaderId: imageObj.uploaderId,
        tags: imageObj.tags.join(' '),
        imgUrl: `http://${QINIU.origin}/${qiniuRes.key}`,
      }
      const image = await ImageMap.createImage(imageOptions)
      if (image && qiniuRes.key) {
        res = {
          status: 200,
          msg: '上传成功！',
        }
      } else {
        res = {
          status: 400,
          msg: '上传失败！',
        }
      }
    } else {
      for (let i = 0; i < images.length; i++) {
        qiniuRes = await uploadToQINIU(images[i].uid, files[i], dirName)
        const imageOptions = {
          id: images[i].uid,
          name: imageObj.name,
          categoryId: imageObj.categoryId,
          uploaderId: imageObj.uploaderId,
          tags: imageObj.tags.join(' '),
          imgUrl: `http://${QINIU.origin}/${qiniuRes.key}`,
        }
        const image = await ImageMap.createImage(imageOptions)
        if (image && qiniuRes.key) {
          res = {
            status: 200,
            msg: '上传成功！',
          }
        } else {
          res = {
            status: 400,
            msg: '上传失败！',
          }
          break
        }
      }
    }
    return res
  },
  updateImage: async function (id, image) {
    let res
    const updateRes = await ImageMap.updateImage(id, image, ImageMap)
    if (updateRes) {
      return (res = {
        status: 200,
        msg: '修改图片成功',
      })
    } else {
      return (res = {
        status: 400,
        msg: '修改图片失败',
      })
    }
  },
  deleteImage: async function (id, url) {
    const imgKey = url.split('com/')[1]
    let res
    const qiniuRes = await QINIUDeleteFile(QINIU.bucket, imgKey)
    const deleteRes = await ImageMap.deleteImage(id, ImageMap)
    if (deleteRes && qiniuRes) {
      return (res = {
        status: 200,
        msg: '删除图片成功',
      })
    } else {
      return (res = {
        status: 400,
        msg: '删除图片失败',
      })
    }
  },
  deleteImages: async function (idList, urlList) {
    urlList = urlList.map((url) => url.split('com/')[1])
    const deleteOperations = []
    urlList.forEach((url) => {
      deleteOperations.push(qiniu.rs.deleteOp(QINIU.bucket, url))
    })
    for (let i = 0; i < idList.length; i++) {
      ImageMap.deleteImage(+idList[i], ImageMap)
    }
    QINIUDeleteFiles(deleteOperations)
    return (res = {
      status: 200,
      msg: '删除图片成功',
    })
    //  else {
    //   return (res = {
    //     status: 400,
    //     msg: '删除图片失败',
    //   })
    // }
  },
  createRandomImage: async function () {
    let res
    const imgs = await ImageMap.getAllImages()
    console.log(imgs)
    const i = createRandomNumWidthScope(0, imgs.length)
    if (objectISEmpty(imgs)) {
      return (res = {
        msg: '随机图片生成成功',
        data: {
          img: imgs[i],
          count: imgs.length,
        },
        status: 200,
      })
    } else {
      return (res = {
        status: 400,
        msg: '获取图片失败',
      })
    }
  },
  //预览图片 浏览图片+1
  previewImageIncrement: async function (id) {
    let res
    const img = await ImageMap.getImageById(id)
    let views = img.views
    views++
    await ImageMap.updateImage(id, { views }, ImageMap)
    return (res = {
      status: 200,
      msg: '添加次数成功',
    })
  },
  downloadsIncrement: async function (id) {
    let res
    const img = await ImageMap.getImageById(id)
    let downloads = img.downloads
    downloads++
    await ImageMap.updateImage(id, { downloads }, ImageMap)
    return (res = {
      status: 200,
      msg: '添加次数成功',
    })
  },
  //计算各类图片的下载量和浏览量
  countForDownloadsAndViews: async function () {
    const images = await ImageMap.getAllImages()
    const countInfo = {}
    let downloadsTotal = 0
    let viewsTotal = 0

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
    imgsArr.forEach((item) => {
      downloadsTotal += item.downloads
      viewsTotal += item.views
      if (!countInfo[item.category_name]) {
        countInfo[item.category_name] = {
          downloads: item.downloads,
          views: item.views,
        }
      } else {
        countInfo[item.category_name].downloads += item.downloads
        countInfo[item.category_name].views += item.views
      }
    })
    return (res = {
      msg: '统计成功',
      data: {
        countInfo,
        viewsTotal,
        downloadsTotal,
      },
      status: 200,
    })
  },
  //计算上传图片按时间赛选
  getImagesByTime: async function (endDate, startDate) {
    let where = {
      createdAt: {
        [Op.lte]: endDate,
        [Op.gte]: startDate,
      },
    }
    const images = await ImageMap.getAllImages({}, where)
    if (!images.length) {
      return (res = {
        msg: '获取失败',
        status: 400,
      })
    }
    let imgsArr = []
    //联表处理数据结果
    for (let i = 0; i < images.length; i++) {
      const item = images[i]
      const user = await item.getUser()
      const category = await item.getImgCategory()

      imgsArr.push({
        id: item.id,
        uploader: user.name,
        category_name: category.name,
        createdAt: item.createdAt,
      })
    }

    if (imgsArr.length) {
      return (res = {
        msg: '获取成功',
        data: imgsArr,
        status: 200,
      })
    }
  },
  getHotImages: async function () {
    let order = [['views', 'DESC']]
    const images = await ImageMap.getAllImages({ limit: 20 }, {}, order)
    if (!images.length) {
      return (res = {
        msg: '获取失败',
        status: 400,
      })
    } else {
      return (res = {
        msg: '获取成功',
        data: images,
        status: 200,
      })
    }
  },
}

const ImageMap = require('../../db/models/Image/mapper')
const { uploadToQINIU, QINIUDeleteFile } = require('../../utils/qiniu')
const QINIU = require('../../config/qiniuConfig')
const {
  createRandomNumWidthScope,
  objectISEmpty,
} = require('../../utils/utils')
module.exports = {
  //获取所有图片分类
  getAllImages: async function (params) {
    let res
    const imgs = await ImageMap.getAllImages(params)
    if (imgs.imgsArr) {
      return (res = {
        status: 200,
        data: imgs,
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
    if (deleteRes) {
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
  createRandomImage: async function () {
    let res
    const imgs = await ImageMap.getAllImages()
    const i = createRandomNumWidthScope(0, imgs.imgsArr.length)
    if (objectISEmpty(imgs)) {
      return (res = {
        msg: '随机图片生成成功',
        data: {
          img: imgs.imgsArr[i],
          count: imgs.imgsArr.length,
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
}

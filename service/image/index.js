const ImageMap = require('../../db/models/Image/mapper')
const uploadToQINIU = require('../../utils/qiniu')
const QINIU = require('../../config/qiniuConfig')
module.exports = {
  //获取所有图片分类
  getAllImages: async function () {
    let res
    const imgs = await ImageMap.getAllImages()
    if (imgs.length) {
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
}

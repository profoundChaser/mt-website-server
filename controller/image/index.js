const ImageService = require('../../service/image/index')
module.exports = {
  getAllImages: async function (ctx, next) {
    let res = await ImageService.getAllImages()
    return res
  },
  //上传图片 与七牛云对接
  uploadImages: async function (ctx, next) {
    let { imageObj } = ctx.request.body
    const files = ctx.request.files
    imageObj=JSON.parse(imageObj)
    let res = await ImageService.uploadImages(imageObj.formDataUUid,files['multipleFiles'],imageObj)
    return res
  },
}

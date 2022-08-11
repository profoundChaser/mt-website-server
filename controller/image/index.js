const ImageService = require('../../service/image/index')
module.exports = {
  getAllImages: async function (ctx, next) {
    const params = JSON.parse(JSON.stringify(ctx.query))
    let res = await ImageService.getAllImages(params)
    return res
  },
  //上传图片 与七牛云对接
  uploadImages: async function (ctx, next) {
    let { imageObj } = ctx.request.body
    const files = ctx.request.files
    imageObj = JSON.parse(imageObj)
    let res = await ImageService.uploadImages(
      imageObj.formDataUUid,
      files['multipleFiles'],
      imageObj
    )
    return res
  },
  updateImage: async function (ctx, next) {
    const { id } = ctx.params
    let { image } = ctx.request.body
    let res = await ImageService.updateImage(id, image)
    return res
  },
  deleteImage: async function (ctx, next) {
    const { id, url } = ctx.request.body
    let res = await ImageService.deleteImage(id, url)
    return res
  },
  createRandomImage: async function (ctx, next) {
    let res = await ImageService.createRandomImage()
    return res
  },
  previewImageIncrement: async function (ctx, next) {
    const { id } = ctx.request.body
    let res = await ImageService.previewImageIncrement(+id)
    return res
  },
  downloadsIncrement: async function (ctx, next) {
    const { id } = ctx.request.body
    let res = await ImageService.downloadsIncrement(+id)
    return res
  },
  countForDownloadsAndViews: async function (ctx, next) {
    let res = await ImageService.countForDownloadsAndViews()
    return res
  },
  getImagesByTime: async function (ctx, next) {
    const { endDate, startDate } = ctx.request.body
    let res = await ImageService.getImagesByTime(endDate, startDate)
    return res
  },
}

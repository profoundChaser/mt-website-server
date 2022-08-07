const router = require('koa-router')()
const QINIU = require('./config/qiniuConfig.js')
const qiniu = require('qiniu')

//控制层api
const UserController = require('./controller/user/index.js')
const CategoryController = require('./controller/category/index.js')
const ImageController = require('./controller/image/index.js')
const StoreController = require('./controller/store')

module.exports = (app) => {
  /* 
  用户模块
  */
  router.post('/login', async (ctx, next) => {
    const res = await UserController.login(ctx, next)
    ctx.body = res
  })
  router.post('/register', async (ctx, next) => {
    const res = await UserController.register(ctx, next)
    ctx.body = res
  })
  router.put('/updateAvatar', async (ctx, next) => {
    const res = await UserController.updateAvatar(ctx, next)
    ctx.body = res
  })
  router.put('/updateUser', async (ctx, next) => {
    const res = await UserController.updateUserInfo(ctx, next)
    ctx.body = res
  })
  router.put('/updatePwd', async (ctx, next) => {
    const res = await UserController.updateUserPwd(ctx, next)
    ctx.body = res
  })
  router.post('/validatePwd', async (ctx, next) => {
    const res = await UserController.validateUserPwd(ctx, next)
    ctx.body = res
  })
  //发送邮件获取验证码
  router.post('/sendEmail', async (ctx, next) => {
    const res = await UserController.sendEmail(ctx, next)
    ctx.body = res
  })
  //校验验证码
  router.post('/verifyCode', async (ctx, next) => {
    const res = await UserController.verifyCode(ctx, next)
    ctx.body = res
  })

  /* 
  分类模块
*/
  router.get('/categories', async (ctx, next) => {
    const res = await CategoryController.getAllCategories(ctx, next)
    ctx.body = res
  })

  /* 
  图片模块
  */
  router.get('/images', async (ctx, next) => {
    const res = await ImageController.getAllImages(ctx, next)
    ctx.body = res
  })

  //图片上传
  router.post('/uploadImages', async (ctx, next) => {
    const res = await ImageController.uploadImages(ctx, next)
    ctx.body = res
  })

  /* 
  收藏模块
  */
  router.get('/stores/:id', async (ctx, next) => {
    const res = await StoreController.getAllStores(ctx, next)
    ctx.body = res
  })

  router.post('/addStore', async (ctx, next) => {
    const res = await StoreController.addStore(ctx, next)
    ctx.body = res
  })

  router.delete('/deleteStore/:id', async (ctx, next) => {
    const res = await StoreController.deleteStore(ctx, next)
    ctx.body = res
  })
  //================管理员模块====================================
  /* 
    用户模块
  */
  router.get('/users', async (ctx, next) => {
    const res = await UserController.getAllUsers(ctx, next)
    ctx.body = res
  })
  /* 
    图片模块
  */
  router.put('/images/:id', async (ctx, next) => {
    const res = await ImageController.updateImage(ctx, next)
    ctx.body = res
  })

  router.post('/updateImage', async (ctx, next) => {
    const res = await ImageController.deleteImage(ctx, next)
    ctx.body = res
  })
  /* 
    token校验部分
  */
  router.get('/invalidateToken', async (ctx, next) => {
    ctx.body = {
      status: 401,
      msg: '权限不足，请重新登录',
    }
  })

  //访问七牛云
  router.get('/getqinui', async (ctx, next) => {
    const mac = new qiniu.auth.digest.Mac(QINIU.accessKey, QINIU.secretKey)
    var config = new qiniu.conf.Config()
    var bucketManager = new qiniu.rs.BucketManager(mac, config)
    var publicBucketDomain = 'http://rfrho6xco.hn-bkt.clouddn.com'
    var publicDownloadUrl = bucketManager.publicDownloadUrl(
      publicBucketDomain,
      'mv'
    )
    ctx.body = JSON.stringify(config)
  })

  app.use(router.routes()).use(router.allowedMethods())
}

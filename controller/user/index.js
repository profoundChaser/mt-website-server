const UserService = require('../../service/user/index.js')

module.exports = {
  login: async function (ctx, next) {
    let params = ctx.request.body
    let email = params.email
    let password = params.password
    let res = await UserService.login(email, password)
    return res
  },
  register: async function (ctx, next) {
    let params = ctx.request.body
    let res = await UserService.register(params)
    return res
  },
  updateAvatar: async function (ctx, next) {
    let { id } = ctx.request.body
    let file = ctx.request.files
    let res = await UserService.updateAvatar(id, file['avatar'], 'avatar')
    return res
  },
  updateUserInfo: async function (ctx, next) {
    let params = ctx.request.body
    let res = await UserService.updateUserInfo(params)
    return res
  },
  updateUserPwd: async function (ctx, next) {
    let params = ctx.request.body
    let res = await UserService.updateUserPwd(params)
    return res
  },
  validateUserPwd: async function (ctx, next) {
    let params = ctx.request.body
    let res = await UserService.validateUserPwd(params)
    return res
  },
  sendEmail: async function (ctx, next) {
    let { email } = ctx.request.body
    let res = await UserService.sendEmail(email)
    return res
  },
  verifyCode: async function (ctx, next) {
    let { code } = ctx.request.body
    let res = await UserService.verifyCode(code)
    return res
  },
  getAllUsers: async function (ctx, next) {
    const params = JSON.parse(JSON.stringify(ctx.query))
    let res = await UserService.getAllUsers(params)
    return res
  },
  deleteUser: async function (ctx, next) {
    let { id } = ctx.request.body
    let res = await UserService.deleteUser(id)
    return res
  },
  deleteUsers: async function (ctx, next) {
    let { idList } = ctx.request.body
    let res = await UserService.deleteUsers(idList)
    return res
  },
}

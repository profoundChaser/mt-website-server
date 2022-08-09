const RoleService = require('../../service/role')
module.exports = {
  getAllRoles: async function (ctx, next) {
    const params = JSON.parse(JSON.stringify(ctx.query))
    let res = await RoleService.getAllRoles(params)
    return res
  },
  addRole: async function (ctx, next) {
    const role = ctx.request.body
    let res = await RoleService.addRole(role)
    return res
  },
  updateRole: async function (ctx, next) {
    const {id ,role} = ctx.request.body
    let res = await RoleService.updateRole(id,role)
    return res
  },
  deleteRole: async function (ctx, next) {
    const { id } = ctx.request.body
    let res = await RoleService.deleteRole(id)
    return res
  },
  deleteRoles: async function (ctx, next) {
    const { idList } = ctx.request.body
    let res = await RoleService.deleteRoles(idList)
    return res
  },
}

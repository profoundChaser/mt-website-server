const RoleMap = require('../../db/models/Role/mapper')
module.exports = {
  getAllRoles: async function () {
    let res = null
    const roleRes = await RoleMap.getAllRoles()
    console.log(roleRes)
    if (roleRes.count) {
      return (res = {
        status: 200,
        msg: '获取角色列表成功',
        data: roleRes,
      })
    } else {
      return (res = {
        status: 400,
        msg: '获取角色列表失败',
      })
    }
  },
}

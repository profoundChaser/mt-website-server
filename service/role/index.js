const RoleMap = require('../../db/models/Role/mapper')
const { objectISEmpty } = require('../../utils/utils')
module.exports = {
  getAllRoles: async function (params) {
    let res = null
    const roleRes = await RoleMap.getAllRoles(params)
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
  addRole: async function (role) {
    let res = null
    const roleRes = await RoleMap.createRole(role)
    if (objectISEmpty(roleRes)) {
      return (res = {
        status: 200,
        msg: '添加角色成功',
        data: roleRes,
      })
    } else {
      return (res = {
        status: 400,
        msg: '添加角色失败',
      })
    }
  },
  updateRole: async function (id, role) {
    let res = null
    const roleRes = await RoleMap.updateRole(id, role, RoleMap)
    if (objectISEmpty(roleRes)) {
      return (res = {
        status: 200,
        msg: '修改角色成功',
        data: roleRes,
      })
    } else {
      return (res = {
        status: 400,
        msg: '修改角色失败',
      })
    }
  },
  deleteRole: async function (id) {
    let res = null
    const roleRes = await RoleMap.deleteRole(id, RoleMap)
    if (objectISEmpty(roleRes)) {
      return (res = {
        status: 200,
        msg: '删除角色成功',
        data: roleRes,
      })
    } else {
      return (res = {
        status: 400,
        msg: '删除角色失败',
      })
    }
  },
  deleteRoles: async function (idList) {
    let res = null
    for (let i = 0; i < idList.length; i++) {
      const roleRes = await RoleMap.deleteUser(idList[i], RoleMap)
      if (i === idList.length - 1) {
        return (res = {
          msg: '删除这些角色成功',
          status: 200,
        })
      }
    }
  },
}

const Role = require('./index.js')
const { Op } = require('sequelize')

const RoleMap = {
  getAllRoles: async (params) => {
    let pageInfo = {}
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
    }
    const roleObj = await Role.findAndCountAll()
    const res = await Role.findAll({
      ...pageInfo,
    })
    return { roles: res, count: roleObj.count }
  },
  getRoleById: async (id) => {
    return Role.findByPk(id)
  },
  updateRole: async (id, role, Role) => {
    const item = await Role.getRoleById(id, RoleMap)
    if (item) {
      return item.update(role)
    } else {
      throw new Error(`the customer with id ${id} is not exist`)
    }
  },
  createRole: async (role) => {
    return Role.create(role)
  },
  deleteRole: async (id, Role) => {
    const role = await Role.getRoleById(id)
    if (role) {
      return role.destroy()
    }
  },
}

module.exports = RoleMap

const Role = require('./index.js')
const { Op } = require('sequelize')

const RoleMap = {
  getAllRoles: async (id) => {
     return Role.findAll()
  },
  getRoleById: async (id) => {
    return Role.findByPk(id)
  },
  getRoleByName: async (name) => {
    return Role.findAll({
      where: {
        name: {
          [Op.like]: `${name}%`,
        },
      },
    })
  },
  updateRole: async (id, role, Role) => {
    const item = await Role.getRoleById(id)
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

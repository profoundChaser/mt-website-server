const User = require('./index.js')
const { Op } = require('sequelize')
const { createAvatar } = require('../../../utils/utils.js')

const UserMap = {
  getAllUsers: async () => {
    return User.findAll({
      attributes: ['id', 'name', 'sex', 'email','roleId'],
      // order: [['createAt', 'DESC']],
    })
  },
  getUserById: async (id) => {
    return User.findByPk(id)
  },
  getUserByName: async (name) => {
    return User.findAll({
      where: {
        name: {
          [Op.like]: `${name}%`,
        },
      },
    })
  },
  getUserByEmail: async (email) => {
    const user=await User.findOne({
      where: {
        email: {
          [Op.like]: `${email}%`,
        },
      },
    })
    const role=await user.getRole()
    return {
      id:user.id,
      name:user.name,
      sex:user.sex,
      email:user.email,
      password:user.password,
      avatar:user.avatar,
      role:role.roleName
    }
  },
  updateUser: async (id, user, User) => {
    const item = await User.getUserById(id)
    if (item) {
      return item.update(user)
    } else {
      throw new Error(`the customer with id ${id} is not exist`)
    }
  },
  createUser: async (user) => {
    return User.create({...user,avatar:createAvatar()})
  },
  deleteUser: async (id, User) => {
    const user = await User.getUserById(id)
    if (user) {
      return user.destroy()
    }
  },
}

module.exports = UserMap

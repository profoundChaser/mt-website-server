const User = require('./index.js')
const { Op } = require('sequelize')
const { createAvatar, objectISEmpty } = require('../../../utils/utils.js')

const UserMap = {
  getAllUsers: async (params) => {
    let pageInfo = {}
    let count = 0
    let where = {}
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
      //请求是否携带查询逻辑
      if (params.searchContent) {
        console.log(params.searchContent)
        let { name, sex, roleId } = JSON.parse(params.searchContent)
        if (name) {
          where.name = {
            [Op.like]: `%${name}%`,
          }
        }
        if (sex || sex === 0) {
          //获取用户对象
          sex = sex === 0 ? '男' : '女'
          console.log(sex)
          where.sex = sex
        }
        if (roleId) {
          where.roleId = roleId
        }
        //按条件获取长度
        const userObj = await User.findAndCountAll({
          where,
        })
        count = userObj.count
      }
    }
    const users = await User.findAll({
      attributes: ['id', 'name', 'sex', 'email', 'roleId'],
      ...pageInfo,
      where,
    })
    return { users, count }
  },
  getUserById: async (id) => {
    return User.findByPk(id)
  },
  getUserByName: async (name) => {
    return User.findOne({
      where: {
        name: name,
      },
    })
  },
  getUserByEmail: async (email) => {
    const user = await User.findOne({
      where: {
        email: {
          [Op.like]: `${email}%`,
        },
      },
    })
    const role = await user.getRole()
    return {
      id: user.id,
      name: user.name,
      sex: user.sex,
      email: user.email,
      password: user.password,
      avatar: user.avatar,
      role: role.roleName,
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
    return User.create({ ...user, avatar: createAvatar() })
  },
  deleteUser: async (id, User) => {
    const user = await User.getUserById(id)
    if (user) {
      return user.destroy()
    }
  },
}

module.exports = UserMap

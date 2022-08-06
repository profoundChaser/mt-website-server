const Sequelize = require('sequelize')
const { createAvatar } = require('../../../utils/utils')
const sequelize = require('../../index')
const Role=require('../Role/index')
const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  sex: {
    type: Sequelize.ENUM(['男', '女']),
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  avatar:{
    type:Sequelize.STRING,
  },
  roleId:{
    type:Sequelize.INTEGER,
  }
})


Role.hasMany(User,{foreignKey:'roleId',sourceKey:'id'})
User.belongsTo(Role,{foreignKey:'roleId',targetKey:'id'})

// User.sync({force:true}).then(() => {
//   return User.create({
//     name: '小白',
//     sex: '女',
//     email:'1111@.qq.com',
//     password:'123456',
//     avatar:createAvatar()
//   })
// })

module.exports = User

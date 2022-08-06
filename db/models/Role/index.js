const Sequelize = require('sequelize')
const { createAvatar } = require('../../../utils/utils')
const sequelize = require('../../index')

const Role = sequelize.define('role', {
  roleName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique:true,
    defaultValue:'user'
  },
},{ timestamps: false })

// Role.sync({force:true}).then(() => {
//   return Role.create(
//     {
//         roleName:'user'
//     }
//   )
// })

module.exports=Role
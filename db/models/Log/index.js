const Sequelize = require('sequelize')
const sequelize = require('../../index')
const Log = sequelize.define(
  'log',
  {
    username: {
      type: Sequelize.STRING,
    },
    host: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING,
    },
    method: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    agent: {
      type: Sequelize.STRING,
    },
  },
  { timestamps: false }
)

Log.sync().then(() => {
//   return Log.create({
//     name: '美女',
//     nameInEn: 'mv',
//   })
})

module.exports = Log

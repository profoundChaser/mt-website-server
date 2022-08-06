const Sequelize = require('sequelize')
const sequelize = require('../../index')
const ImgCategory = sequelize.define(
  'imgCategory',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    nameInEn: {
      type: Sequelize.STRING,
      unique: true,
    },
    imgCover:{
      type: Sequelize.STRING,
    }
  },
  { timestamps: false }
)

// ImgCategory.sync().then(() => {
//   return ImgCategory.create({
//     name: '美女',
//     nameInEn: 'mv',
//   })
// })

module.exports = ImgCategory

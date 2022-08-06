const Sequelize = require('sequelize')
const sequelize = require('../../index')
const ImgCategory = require('../Category/index')
const User = require('../User/index')

const Image = sequelize.define('image', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imgUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  uploaderId: {
    type: Sequelize.INTEGER,
    /* 直接设置外键的方式 */
    // onDelete: 'CASCADE',
    // references: {
    //   model: 'users',
    //   key: 'id',
    // },
  },
  //设置分类id的外键
  categoryId: {
    type: Sequelize.INTEGER,
  },
  downloads: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  views: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
})

//多表关联 外键都在image 此时Image原型上有getUser方法
User.hasMany(Image, { foreignKey: 'uploaderId', sourceKey: 'id' })
Image.belongsTo(User, { foreignKey: 'uploaderId', targetKey: 'id' })

//同理更得getImgCategory 这是根据模型的名字命令的方法
ImgCategory.hasMany(Image, { foreignKey: 'categoryId', sourceKey: 'id' })
Image.belongsTo(ImgCategory, { foreignKey: 'categoryId', targetKey: 'id' })

// Image.sync({force:true}).then(() => {
//   return Image.create({
//     id:Date.now(),
//     name: '王曦谣白色连衣露肤装',
//     imgUrl:
//       'http://rfrho6xco.hn-bkt.clouddn.com/mv/0020r4qogy1gtueecrbsoj60xc1e0tor02_edit_872666037019655.jpg',
//     uploaderId: 1,
//     categoryId: 1,
//   })
// })

module.exports = Image

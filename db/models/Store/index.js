const Sequelize = require('sequelize')
const sequelize = require('../../index')
const User = require('../User/index')
const Image = require('../Image/index')
const ImgStore = sequelize.define('imgStore', {
  imgId: {
    type: Sequelize.UUID,
  },
  storeUserId: {
    type: Sequelize.INTEGER,
  },
})

// ImgStore.sync({force:true}).then(() => {
//   return ImgStore.create({
//     imgId: 1659532251698,
//     storeUserId: 3,
//   })
// })

//多表关联 外键都在image 此时Image原型上有getUser方法
User.hasMany(ImgStore, { foreignKey: 'storeUserId', sourceKey: 'id' })
ImgStore.belongsTo(User, { foreignKey: 'storeUserId', targetkey: 'id' })

//同理更得getImgCategory 这是根据模型的名字命令的方法
Image.hasMany(ImgStore, { foreignKey: 'imgId', sourceKey: 'id' })
ImgStore.belongsTo(Image, { foreignKey: 'imgId', targetkey: 'id' })

// ImgStore.groupByTime = function (attr) {
//   return attr.split(' ')[0]
// }

module.exports = ImgStore

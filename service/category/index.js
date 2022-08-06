const CategoryMap = require('../../db/models/Category/mapper')

module.exports = {
  //获取所有图片分类
  getAllCategories: async function () {
    let res
    const categories = await CategoryMap.getAllCategories()
    if (categories.count) {
      return (res = {
        status: 200,
        data: categories,
        msg: '获取分类成功',
      })
    } else {
      return (res = {
        status: 400,
        msg: '获取分类失败',
      })
    }
  },
}

const CategoryService = require('../../service/category/index')

module.exports = {
  getAllCategories: async function (ctx, next) {
    let res = await CategoryService.getAllCategories()
    return res
  },
  getCategoryById:async function (ctx,next){
    let res=await CategoryService.getCategoryById()
    return res
  }
}

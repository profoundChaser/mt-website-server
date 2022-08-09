const CategoryService = require('../../service/category/index')

module.exports = {
  getAllCategories: async function (ctx, next) {
    const params = JSON.parse(JSON.stringify(ctx.query))
    let res = await CategoryService.getAllCategories(params)
    return res
  },
  getCategoryById:async function (ctx,next){
    let res=await CategoryService.getCategoryById()
    return res
  },
  addCategory: async function (ctx, next) {
    const Category = ctx.request.body
    let res = await CategoryService.addCategory(Category)
    return res
  },
  updateCategory: async function (ctx, next) {
    const {id ,Category} = ctx.request.body
    let res = await CategoryService.updateCategory(id,Category)
    return res
  },
  deleteCategory: async function (ctx, next) {
    const { id } = ctx.request.body
    let res = await CategoryService.deleteCategory(id)
    return res
  },
  deleteCategories: async function (ctx, next) {
    const { idList } = ctx.request.body
    let res = await CategoryService.deleteCategories(idList)
    return res
  },
}

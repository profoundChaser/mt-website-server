const StoreService = require('../../service/store')
module.exports = {
  getAllStores: async function (ctx, next) {
    const { id } = ctx.params
    let res = await StoreService.getAllStores(id)
    return res
  },
  addStore: async function (ctx, next) {
    const store = ctx.request.body
    let res = await StoreService.addStore(store)
    return res
  },
  deleteStore: async function (ctx, next) {
    const { id } = ctx.params
    let res = await StoreService.deleteStore(id)
    return res
  },
}

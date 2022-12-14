const StoreMap = require('../../db/models/Store/mapper')

module.exports = {
  getAllStores: async function (id) {
    let res
    const stores = await StoreMap.getAllStores(id)
    const imgArr = []
    for (let i = 0; i < stores.length; i++) {
      const item = stores[i]
      const image =await item.getImage()
      imgArr.push({
        id: item.id,
        imgUrl: image.imgUrl,
        storeTime:item.createAt
      })
    }
    return (res = {
      status: 200,
      data: imgArr,
      mag: '获取收藏图片成功',
    })
  },
  addStore: async function (store) {
    let res
    const storeRes = await StoreMap.createStore(store)
    if (storeRes) {
      return (res = {
        status: 200,
        msg: '添加收藏成功',
      })
    }
  },
  deleteStore: async function (id) {
    let res
    const store = await StoreMap.deleteStore(id, StoreMap)
    if (store) {
      return (res = {
        status: 200,
        msg: '删除收藏成功',
      })
    }
  },
}

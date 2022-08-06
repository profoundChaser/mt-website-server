const Store = require('./index.js')
const { Op } = require('sequelize')

const StoreMap = {
  getAllStores: async (id) => {
    const imgStoreCountObj = await Store.findAndCountAll({
      where: {
        storeUserId:id
      },
      order: [['createdAt', 'DESC']],
    })
    const storeArr = []
    for (let i = 0; i < imgStoreCountObj.rows.length; i++) {
      const item = imgStoreCountObj.rows[i]
      const image = await item.getImage()
      storeArr.push({
        id: item.id,
        imgId: item.imgId,
        storeUserId: item.storeUserId,
        imgUrl: image.imgUrl,
      })
    }
    return storeArr
  },
  getStoreById: async (id) => {
    return Store.findByPk(id)
  },
  getStoreByName: async (name) => {
    return Store.findAll({
      where: {
        name: {
          [Op.like]: `${name}%`,
        },
      },
    })
  },
  updateStore: async (id, store, Store) => {
    const item = await Store.getStoreById(id)
    if (item) {
      return item.update(store)
    } else {
      throw new Error(`the customer with id ${id} is not exist`)
    }
  },
  createStore: async (store) => {
    return Store.create(store)
  },
  deleteStore: async (id, Store) => {
    const store = await Store.getStoreById(id)
    if (store) {
      return store.destroy()
    }
  },
}

module.exports = StoreMap

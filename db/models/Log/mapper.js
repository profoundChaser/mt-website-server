const Log = require('./index.js')
const { Op } = require('sequelize')

const LogMap = {
  getAllLogs: async (params) => {
    let pageInfo = {}
    if (params) {
      //请求是否携带分页逻辑
      if (params.pageSize) {
        pageSize = params.pageSize
        pageIndex = params.pageIndex
        pageInfo = {
          limit: +pageSize,
          offset: (pageIndex - 1) * +pageSize,
        }
      }
    }
    const logObj = await Log.findAndCountAll()
    const res = await Log.findAll({
      ...pageInfo,
    })
    return { logs: res, count: logObj.count }
  },
  getLogById: async (id) => {
    return Log.findByPk(id)
  },
  updateLog: async (id, log, LogMap) => {
    const item = await LogMap.getLogById(id)
    if (item) {
      return item.update(log)
    } else {
      throw new Error(`the customer with id ${id} is not exist`)
    }
  },
  createLog: async (log) => {
    return Log.create(log)
  },
  deleteLog: async (id, LogMap) => {
    const log = await LogMap.getLogById(id)
    if (log) {
      return Log.destroy()
    }
  },
}

module.exports = LogMap

const LogMap = require('../../db/models/Log/mapper')
const { objectISEmpty } = require('../../utils/utils')
module.exports = {
  getAllLogs: async function (params) {
    let res = null
    const logRes = await LogMap.getAllLogs(params)
    if (logRes.count) {
      return (res = {
        status: 200,
        msg: '获取日志列表成功',
        data: logRes,
      })
    } else {
      return (res = {
        status: 400,
        msg: '获取日志列表失败',
      })
    }
  },
//   addLog: async function (log) {
//     let res = null
//     const logRes = await LogMap.createLog(log)
//     if (objectISEmpty(logRes)) {
//       return (res = {
//         status: 200,
//         msg: '添加日志成功',
//         data: logRes,
//       })
//     } else {
//       return (res = {
//         status: 400,
//         msg: '添加日志失败',
//       })
//     }
//   },
//   updateLog: async function (id, log) {
//     let res = null
//     const logRes = await LogMap.updateLog(id, log, LogMap)
//     if (objectISEmpty(logRes)) {
//       return (res = {
//         status: 200,
//         msg: '修改日志成功',
//         data: logRes,
//       })
//     } else {
//       return (res = {
//         status: 400,
//         msg: '修改日志失败',
//       })
//     }
//   },
  deleteLog: async function (id) {
    let res = null
    const logRes = await LogMap.deleteLog(id, LogMap)
    if (objectISEmpty(logRes)) {
      return (res = {
        status: 200,
        msg: '删除日志成功',
        data: logRes,
      })
    } else {
      return (res = {
        status: 400,
        msg: '删除日志失败',
      })
    }
  },
  deleteLogs: async function (idList) {
    let res = null
    for (let i = 0; i < idList.length; i++) {
      const logRes = await LogMap.deleteUser(idList[i], LogMap)
      if (i === idList.length - 1) {
        return (res = {
          msg: '删除这些日志成功',
          status: 200,
        })
      }
    }
  },
}

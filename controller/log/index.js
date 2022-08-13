const LogService = require('../../service/log')
module.exports = {
  getAllLogs: async function (ctx, next) {
    const params = JSON.parse(JSON.stringify(ctx.query))
    let res = await LogService.getAllLogs(params)
    return res
  },
//   addLog: async function (ctx, next) {
//     const log = ctx.request.body
//     let res = await LogService.addLog(log)
//     return res
//   },
//   updateLog: async function (ctx, next) {
//     const {id ,log} = ctx.request.body
//     let res = await LogService.updateLog(id,log)
//     return res
//   },
  deleteLog: async function (ctx, next) {
    const { id } = ctx.request.body
    let res = await LogService.deleteLog(id)
    return res
  },
  deleteLogs: async function (ctx, next) {
    const { idList } = ctx.request.body
    let res = await LogService.deleteLogs(idList)
    return res
  },
}

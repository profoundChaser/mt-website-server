const jwt = require('jsonwebtoken')
const { key } = require('../../utils/crypto')
const { time13TransferTime10 } = require('../../utils/utils')
const checkToken = async (ctx, next) => {
  const url = ctx.request.url
  let res
  if (url == '/login' || url == '/register') {
    await next()
  } else {
    const token = ctx.request.header['authorization']
    try {
      const tokenInfo = jwt.verify(token, key)
      // 将token的创建的时间和过期时间结构出来
      const { iat, exp } = tokenInfo
      // 拿到当前的时间
      let date = new Date().getTime()
      if (time13TransferTime10(date)- iat <= exp) {
        await next()
      } else {
        ctx.body = {
          status: 401,
          message: 'token 已过期，请重新登陆',
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = checkToken

const jwt = require('jsonwebtoken')
const { key } = require('../../utils/crypto')
const { time13TransferTime10 } = require('../../utils/utils')
const checkToken = async (ctx, next) => {
  const url = ctx.request.url
  let res
  whiteList = [
    '/login',
    '/register',
    '/images',
    '/categories',
    '/hotImages',
    '/randomImage',
  ]
  if (whiteList.includes(url)) {
    await next()
  } else {
    try {
      const token = ctx.request.header['authorization']
      console.log(token)
      const tokenInfo = jwt.verify(token, key)
      // 将token的创建的时间和过期时间结构出来
      const { iat, exp } = tokenInfo
      // 拿到当前的时间
      let date = new Date().getTime()
      if (token) {
        if (time13TransferTime10(date) - iat <= exp) {
          console.log('未超时')
          await next()
        } else {
          ctx.status = 401
          ctx.body = {
            status: 401,
            message: 'token 已过期，请重新登陆',
          }
        }
      } else {
        ctx.status = 401
        ctx.body = {
          status: 401,
          message: '权限不足，请先登录',
        }
      }
    } catch (err) {
      ctx.status = 401
      ctx.body = {
        status:401,
        message: 'token认证失败,请重新登录',
      }
    }
  }
}

module.exports = checkToken

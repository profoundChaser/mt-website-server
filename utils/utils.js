const gravatar = require('gravatar')
const { url } = require('../config/config')
module.exports = {
  ArrayISEmpty(array) {
    return array.length === 0
  },
  //生成默认头像
  createAvatar() {
    return url + '/img/avatar/default_avatar.jpg'
  },
  //生成几位数的随机数
  createRandomNum(n) {
    let res = ''
    for (let i = 0; i < n; i++) {
      res += ~~(Math.random() * 9)
    }
    return res
  },
  time13TransferTime10(time) {
    return Math.round(time / 1000)
  },
  createRandomNumWidthScope(min, max) {
    return ~~(Math.random() * (max - min) + min)
  },
  objectISEmpty(obj) {
    return Object.keys(obj).length > 0
  },
}

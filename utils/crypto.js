const crypto = require('crypto')

module.exports = {
  encrypt: function (key, iv, data) {
    let decipher = crypto.createCipheriv('aes-128-cbc', key, iv)
    return decipher.update(data, 'utf8', 'base64') + decipher.final('base64')
  },
  decrypt: function (key, iv, cryptVal) {
    cryptVal = Buffer.from(cryptVal, 'base64')
    let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
    return decipher.update(cryptVal, 'binary', 'utf8') + decipher.final('utf8')
  },
  key: '123456789abcdefg',
  iv: 'abcdefg123456789',
}

const UserMap = require('../../db/models/User/mapper')
const { encrypt, decrypt, key, iv } = require('../../utils/crypto')
const jwt = require('jsonwebtoken')
const { ArrayISEmpty } = require('../../utils/utils')
const config = require('../../config/config')
const sendEmailToGetCode = require('../../utils/sendEmail')
const uploadToQINIU = require('../../utils/qiniu')
const QINIU = require('../../config/qiniuConfig')

module.exports = {
  login: async function (reqEmail, pwd) {
    let res
    const user = await UserMap.getUserByEmail(reqEmail)
    console.log(user)
    if (ArrayISEmpty(user)) {
      return (res = {
        status: 400,
        data: {},
        msg: '邮箱不存在',
      })
    } else {
      let { name, password, id } = user
      //token标识
      const SECRET_KEY = key
      // Token 数据
      const payload = {
        name,
        id,
      }
      //解密
      // password = decrypt(key, iv, password)
      if (password === pwd) {
        const Token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1day' })
        return (res = {
          status: 200,
          data: user,
          Token,
          msg: '登录成功',
        })
      } else {
        return (res = {
          status: 400,
          data: {},
          msg: '用户邮箱密码不匹配',
        })
      }
    }
  },
  register: async function (params) {
    let res
    let { name, email, password, sex } = params
    sex = sex === '0' ? '男' : '女'
    // password = encrypt(key, iv, password)
    const userInfo = await UserMap.getUserByName(name)
    if (!ArrayISEmpty(userInfo)) {
      return (res = {
        status: 400,
        data: {},
        msg: '此名称也被注册了！！！',
      })
    } else {
      const user = await UserMap.createUser({ email, name, password, sex })
      if (user) {
        return (res = {
          status: 200,
          msg: '注册成功',
          data: {},
        })
      } else {
        return (res = {
          status: 400,
          msg: '注册失败,数据库有误',
          data: {},
        })
      }
    }
  },
  updateAvatar: async function (id, file, dirName) {
    let res
    qiniuRes = await uploadToQINIU(file.newFilename, file, dirName)
    // UserMap.updateUser(id, { avatar })
    return (res = {})
  },
  updateUserInfo: async function (params) {
    let res
    const { id, info } = params
    info.sex = info.sex === '0' ? '男' : '女'
    const user = await UserMap.updateUser(id, info, UserMap)
    return (res = {
      status: 200,
      data: {
        name: user.name,
        id: user.id,
        email: user.email,
        sex: user.sex,
        avatar: user.avatar,
      },
      msg: '修改用户成功',
    })
  },
  updateUserPwd: async function (params) {
    let res
    const { id, password } = params
    const user = UserMap.updateUser(id, { password }, UserMap)
    if (user) {
      return (res = {
        status: 200,
        msg: '密码修改成功',
      })
    } else {
      return (res = {
        status: 400,
        msg: '密码修改失败',
      })
    }
  },
  validateUserPwd: async function (params) {
    let res
    const { id, old_password } = params
    const user = await UserMap.getUserById(id)
    const password = user.password
    if (old_password === password) {
      return (res = {
        status: 200,
        msg: '密码匹配',
      })
    } else {
      return (res = {
        status: 400,
        msg: '该密码不正确',
      })
    }
  },
  sendEmail: async function (email) {
    sendEmailToGetCode(email)
    return (res = {
      status: 200,
      msg: '获取验证码成功',
    })
  },
  verifyCode: async function (code) {
    let res
    const old_code = config.code
    if (!old_code)
      return (res = {
        status: 400,
        msg: '验证码失效，请重新发送',
      })
    code = code + ''
    if (code === old_code) {
      return (res = {
        status: 200,
        msg: '校验成功',
      })
    } else {
      return (res = {
        status: 400,
        msg: '验证码错误,请重试或者重新发送',
      })
    }
  },
  getAllUsers: async function () {
    let res
    const users = await UserMap.getAllUsers()
    if (users.length) {
      return (res = {
        status: 200,
        data: users,
        msg: '获取用户列表成功',
      })
    } else {
      return (res = {
        status: 400,
        msg: '获取用户列表失败',
      })
    }
  },
}

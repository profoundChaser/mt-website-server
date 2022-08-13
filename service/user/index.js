const UserMap = require('../../db/models/User/mapper')
const { encrypt, decrypt, key, iv } = require('../../utils/crypto')
const jwt = require('jsonwebtoken')
const { ArrayISEmpty, objectISEmpty } = require('../../utils/utils')
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
      password = decrypt(key, iv, password)
      if (password === pwd) {
        const Token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
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
    password = encrypt(key, iv, password)
    const userInfo = await UserMap.getUserByName(name)
    const users = await UserMap.getAllUsers()
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email) {
        return (res = {
          status: 400,
          msg: '该邮箱已经存在，请更换',
        })
      }
    }
    if (userInfo) {
      if (!ArrayISEmpty(userInfo)) {
        return (res = {
          status: 400,
          data: {},
          msg: '此名称也被注册了！！！',
        })
      }
    } else {
      let userOptions
      if (params.roleId) {
        userOptions = { email, name, password, sex, roleId: params.roleId }
      } else {
        userOptions = { email, name, password, sex, roleId: 1 }
      }
      const user = await UserMap.createUser(userOptions)
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
    const { id, user } = params
    user.sex = user.sex === '0' ? '男' : '女'
    const userRes = await UserMap.updateUser(id, user, UserMap)
    return (res = {
      status: 200,
      data: {
        name: userRes.name,
        id: userRes.id,
        email: userRes.email,
        sex: userRes.sex,
        avatar: userRes.avatar,
        roleId: userRes.roleId,
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
  getAllUsers: async function (params) {
    let res
    const result = await UserMap.getAllUsers(params)
    if (objectISEmpty(result)) {
      return (res = {
        status: 200,
        data: result,
        msg: '获取用户列表成功',
      })
    } else {
      return (res = {
        status: 400,
        msg: '获取用户列表失败',
      })
    }
  },
  deleteUser: async function (id) {
    let res
    const user = await UserMap.deleteUser(id, UserMap)
    return (res = {
      msg: '删除成功',
      status: 200,
    })
  },
  deleteUsers: async function (idList) {
    let res
    for (let i = 0; i < idList.length; i++) {
      const user = await UserMap.deleteUser(idList[i], UserMap)
      if (i === idList.length - 1) {
        return (res = {
          msg: '删除成功',
          status: 200,
        })
      }
    }
  },
}

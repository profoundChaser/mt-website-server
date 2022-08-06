const nodemailer = require('nodemailer')
const { createRandomNum } = require('./utils')
const config = require('../config/config')
const sendEmailToGetCode = async (email) => {
  console.log(email)
  // 创建Nodemailer传输器 SMTP 或者 其他 运输机制
  let transporter = nodemailer.createTransport({
    host: 'smtp.163.com', // 第三方邮箱的主机地址
    port: 465,
    secureConnection: true,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'wsq1230730@163.com', // 发送方邮箱的账号
      pass: 'RPPNKNUMMEDOSRMK', // 邮箱授权密码
    },
  })
  const code = createRandomNum(6)
  //存储code
  config.code = code
  const codeInvalidate = setTimeout(() => {
    config.code=null
    clearTimeout(codeInvalidate)
  }, 60 * 1000)
  // 定义transport对象并发送邮件
  let info = await transporter.sendMail(
    {
      from: 'wsq1230730@163.com', // 发送方邮箱的账号
      to: `wsq1230730@163.com,${email}`, // 邮箱接受者的账号
      subject: '获取验证码', // Subject line
      text: '获取验证码？', // 文本内容
      html: `欢迎注册vein官网, 您的邮箱验证码是:<b style="color:#3bc66f;text-decoration: underline;">${code}</b>`, // html 内容, 如果设置了html内容, 将忽略text内容
    },
    function (error, response) {
      if (error) {
        console.error(error)
      } else {
      }
      transporter.close() // 如果没用，关闭连接池
    }
  )
}
module.exports = sendEmailToGetCode

const QINIU = require('../config/qiniuConfig')
const qiniu = require('qiniu')
const fs = require('fs')
function createBucketManager() {
  const mac = new qiniu.auth.digest.Mac(QINIU.accessKey, QINIU.secretKey)
  const config = new qiniu.conf.Config()
  //config.useHttpsDomain = true;
  config.zone = qiniu.zone.zone2
  const bucketManager = new qiniu.rs.BucketManager(mac, config)
  return bucketManager
}
module.exports = {
  uploadToQINIU: function (filename, file, dirName) {
    //七牛配置
    const mac = new qiniu.auth.digest.Mac(QINIU.accessKey, QINIU.secretKey)
    const options = {
      scope: QINIU.bucket,
    }
    //生成策略和token
    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(mac)
    //配置 zone 华东机房  zone1 华北机房  zone2 华南机房   zoneNa0 北美
    var config = new qiniu.conf.Config()
    config.zone = qiniu.zone.zone2
    //获取文件上传对象
    const formUploader = new qiniu.form_up.FormUploader(config)
    const putExtra = new qiniu.form_up.PutExtra()
    //文件名
    const fileName = filename
    // 创建文件可读流
    const reader = fs.createReadStream(file.filepath)
    // 获取上传文件扩展名
    const ext = file.originalFilename.split('.').pop()
    // 命名文件以及拓展名
    const fileUrl = `${dirName}/${fileName}.${ext}`
    return new Promise((resolve, reject) => {
      formUploader.putStream(
        uploadToken,
        fileUrl,
        reader,
        putExtra,
        function (err, res, respInfo) {
          if (err) {
            reject(err)
          } else {
            //  返回的是key:文件名和hash:文件信息
            // "hash": "XXX",
            // "key": "public/b59b7a70-d686-11ec-bed9-1fde74428146.jpg"
            resolve(res)
          }
        }
      )
    })
  },
  QINIUDeleteFile: function (bucket, key) {
    const bucketManager = createBucketManager()
    return new Promise((resolve, reject) => {
      bucketManager.delete(bucket, key, function (err, respBody, respInfo) {
        if (err) {
          reject(err)
          //throw err;
        } else {
          resolve(respBody)
        }
      })
    })
  },
}

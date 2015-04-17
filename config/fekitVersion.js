var fs = require('fs')
var path = require('path')
//得到同一目录下的version.json配置文件
var versionJson = require("./version.json")

var qzzPath = [versionJson.qzzHost, '/', versionJson.qzz, '/prd/'].join('') //网络路径
var qzzLocalPath = path.join(path.resolve(__dirname + '/..'), versionJson.path) //硬盘路径
var mapping = fs.readFileSync(qzzLocalPath, 'utf-8') //这是一个字符串

var versions = {} //转换为一个以文件名：版本号形式存放的对象
mapping.split('\n').forEach(function (val) {
    var kv = val.split('#')
    versions[kv[0].replace(/^\.[\/\\]/, '')] = kv[1]
})

exports.getBase64Path = function (key) {
    key = key.replace(/^[\.\/\\]+/, '')
    var ver
    if (versions.hasOwnProperty(key)) {
        ver = versions[key] || ''
    } else {
        ver = 'dev'
    }
    key = key.replace(/(\.js|\.css)$/, '@' + ver + '$1')
    return qzzPath + key  //返回一个完整的路径，并且最后添加上 @  + base64
}
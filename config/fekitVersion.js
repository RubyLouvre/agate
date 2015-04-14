var fs = require('fs')

var VERSION_FILE  //version.mapping的文件路径
var QZZ_PATH  //qzz项目的路径
var VERS  //版本号的map

function getVersion() {

    var mapping, arr, ver = {}
    mapping = fs.readFileSync(VERSION_FILE, 'utf-8')
    arr = mapping.split('\n')
    arr.forEach(function (val) {
        var kv = val.split('#') 
        ver[kv[0].replace(/^\.[\/\\]/, '')] = kv[1] 
    }) 
    return ver 

}

exports.getVersion = function () {
    return VERS 
} 


exports.flushVersions = function () {
    VERS = getVersion() 
    exports.vers = VERS 
}

/**
 * 初始化版本号 opts.path
 * @param opts
 */
exports.configure = function (opts) {
    VERSION_FILE = opts.path 
    QZZ_PATH = [opts.qzzHost , '/', opts.qzz , '/prd/'].join('') 
    exports.flushVersions() 
}

exports.version = function version(key) {

    key = key.replace(/^[\.\/\\]+/, '') 
    var ver 

    if (key in VERS) {
        ver = VERS[key] || '' 
    } else {
        ver = 'dev' 
    }
    key = key.replace(/(\.js|\.css)$/, '@' + ver + '$1')

    return QZZ_PATH + key 

}
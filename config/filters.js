var versionJson = require("./version.json")
var fekitVersion = require("./fekitVersion")
fekitVersion.configure(versionJson)
module.exports = {
    //处理fekit前端资源版本号
    qzzUrl: fekitVersion.version
}
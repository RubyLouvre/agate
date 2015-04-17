//在这里集中添加各种全局过滤器
var fekitVersion = require("./fekitVersion")
module.exports = {
    //处理fekit前端资源版本号
    qzzUrl: fekitVersion.getBase64Path
}
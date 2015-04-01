
exports.index = function *(next) {
   yield this.render("doc/index", {
       body: "这是文档首页"
   })
}

exports.logger =  function *(next) {
   yield this.render("doc/logger")
}

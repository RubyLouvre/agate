
exports.index = function *(next) {
   yield this.render("doc/index", {
       body: "这是文档首页"
   })
}

exports.logger =  function *(next) {
   yield this.render("doc/logger")
}
exports["es6-generators"] =  function *(next) {
   yield this.render("doc/es6-generators")
}


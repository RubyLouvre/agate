
exports.index = function *(next) {
   yield this.render("doc/index", {
       body: "这是文档首页"
   })
}

exports.about =  function *(next) {
   yield this.render("doc/about", {
       body: "这是about"
   })
}

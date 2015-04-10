
exports.index = function *(next) {
   yield this.render("doc/index", {
       body: "这是文档首页"
   })
}

exports.logger =  function *(next) {
   yield this.render("doc/logger")
}

exports.cookie =  function *(next) {
    this.cookies.set('aaa', 'bbb' ); 
    this.cookies.set('xxx','yyy' );
    yield this.render("doc/cookie",{
       cookie: "author=司徒正美"
   })
}

exports["es6-generators"] =  function *(next) {
   yield this.render("doc/es6-generators")
}

exports["favicon"] =  function *(next) {
   yield this.render("doc/favicon")
}

exports["static"] =  function *(next) {
   yield this.render("doc/static")
}

exports["fekitVersion"] =  function *(next) {
    yield this.render("doc/fekitVersion", {
        links: ["common.css"],
        scripts: ["common.js"],
        layout: "../layout/template_fekit"
    })
}

exports["cacti"] =  function *(next) {
    yield this.render("doc/cacti")
}
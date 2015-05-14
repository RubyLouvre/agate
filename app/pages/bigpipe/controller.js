var path = require("path")
exports.index = function * (next) {
    var BigPipe = require("bigpipe")
    var b = new BigPipe(4)
    var layout = app.getLayout("template-bigpipe.html")
    this.body = b.stream
    this.type = "html"

    b.begin(layout)

    b.flush(path.join(__dirname, "./index.html"), 0)

    setTimeout(function () {
        b.flush(path.join(__dirname, "./left.html"), 1)
    }, 2000)
    setTimeout(function () {
        b.flush(path.join(__dirname, "./middle.html"), 2)
    }, 1000)
    b.flush(path.join(__dirname, "./right.html"), 3)
//https://www.ibm.com/developerworks/cn/java/j-lo-bigpipe/
}
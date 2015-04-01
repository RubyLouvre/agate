
var routes = {

  "get /": {
    controller: "doc",
    action: "index"
  },
  "get /es6-generators": {
    controller: "doc",
    action: "es6-generators"
  },
  "get /logger": {
    controller: "doc",
    action: "logger"
  }
}

module.exports = routes
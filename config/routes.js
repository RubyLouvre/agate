
var routes = {

  "get /": {
    controller: "doc",
    action: "index"
  },
  "get /about": {
    controller: "doc",
    action: "about"
  },
  "get /logger": {
    controller: "doc",
    action: "logger"
  }
}

module.exports = routes
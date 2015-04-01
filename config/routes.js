
var routes = {

  "get /": {
    controller: "doc",
    action: "index"
  },
  "get /about": {
    controller: "doc",
    action: "about"
  }
}

module.exports = routes
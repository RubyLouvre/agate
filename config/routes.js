
var routes = {
    "get /": {
        controller: "doc",
        action: "index"
    },
    "get /doc": {
        controller: "doc",
        action: "index"
    }
}
"es6-generators logger, cookie, favion".replace(/\w+/g, function (action) {
    routes["get /" + action] = {
        controller: "doc",
        action: action
    }
})

module.exports = routes
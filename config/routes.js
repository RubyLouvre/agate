
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
"es6-generators logger cookie static favicon".replace(/[\w-]+/g, function (action) {
    routes["get /" + action] = {
        controller: "doc",
        action: action
    }
})
"login".replace(/[\w-]+/g, function (action) {
    routes["get /" + action] = {
        controller: "doc-section",
        action: action
    }
})
module.exports = routes
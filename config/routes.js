
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
module.exports = routes

var mapper = {
}

String("get post delete put").replace(/\w+/g, function (method) {
    mapper[method] = function (rule, dispatch) {
        var arr = dispatch.split("#")
        routes[method + " " + rule] = {
            controller: arr[0],
            action: arr[1]
        }
        return mapper
    }
})


"es6-generators logger cookie static favicon".replace(/[\w-]+/g, function (action) {
    routes["get /" + action] = {
        controller: "doc",
        action: action
    }
})

//https://github.com/1602/compound
mapper.get("/login", "doc-session#login")
mapper.post("/login", "doc-session#login")
mapper.get("/user", "doc-session#user")
mapper.get("/sessionother", "doc-session#other")
mapper.get("/logout", "doc-session#logout")


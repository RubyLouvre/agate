var koa = require('koa');
var path = require('path');
var app = koa();
var http = require("http")

var router = require('koa-router')();
var log4js = require('log4js');
var render = require('koa-ejs');
render(app, {
        root: path.join(__dirname, 'app', "pages"),
        layout: 'layout/template',
        viewExt: 'html',
        cache: false,
        debug: true
                // locals: locals,
                // filters: filters
});
//错误处理
//https://github.com/koajs/onerror/blob/master/index.js
app.use(function*(next) {
        try {
                yield next;
        } catch (err) {
                if (!(err instanceof Error)) {
                        var old = JSON.stringify(err)
                        err = {
                                stack: "内部抛出非Error类型的错误信息，无法追踪其位置",
                                name: "TypeError",
                                message: old,
                                status: 500
                        }
                }

                // delegate
                this.app.emit('error', err, this);
                // nothing we can do here other
                // than delegate to the app-level
                // handler and log.
                if (this.headerSent || !this.writable) {
                        err.headerSent = true;
                        return;
                }

                // ENOENT support
                if ('ENOENT' === err.code) {
                        err.status = 404;
                }

                if ('number' !== typeof err.status || !http.STATUS_CODES[err.status]) {
                        err.status = 500;
                }
                this.status = err.status;
                yield this.render('error', {
                        name: err.name,
                        message: err.message,
                        stack: err.stack
                });
        }
})


var loggerName = 'normal';
var logjson = require(path.join(__dirname, 'log4js.json'))
app.logger = log4js.configure(logjson);
app.use(function*(next) {
        var req = this.request,
                header = req.header
        log4js.getLogger("normal").info([req.ip, req.method, req.url, header['user-agent']].join(" "))
        yield next;
})

//this.env = process.env.NODE_ENV || 'development';

//加载所有路由规则
var routes = require(path.join(__dirname, "config", "routes.js"))
        //缓存所有控制器
var controllers = Object.create(null)
        //参考rails3 的目录结构 https://ruby-china.org/topics/2432
        // http://rails.pixnet.net/blog/post/22952893-%E6%B7%B1%E5%85%A5%E6%B7%BA%E5%87%BA-ror-(3)---%E7%9B%AE%E9%8C%84%E7%B5%90%E6%A7%8B
Object.keys(routes).forEach(function(key) {
        var val = routes[key]
        var arr = key.split(" ")
        var method = arr[0].toLowerCase()
        var rule = arr[1]
        var scontroller = val.controller
        var saction = val.action
        var controller
        if (typeof controllers[scontroller] === "object") {
                controller = controllers[scontroller]
        } else {
                try {
                        var controllerPath = path.join(__dirname, "app", "pages", scontroller, "controller.js")
                        controller = require(controllerPath)
                } catch (e) {
                        console.log(e)
                }


        }
        var action = controller[saction]
        console.log(action + "")
        if (typeof action === "function") {
                router[method](rule, action)
        } else {

        }

})



router
        .get('/users', function*(next) {
                var users = ["司徒正美", "清风火羽", "古道瘦马"]
                yield this.render('list', {
                        layout: "template2",
                        h2: "这是用户列表页",
                        users: users
                })
        })
        .get('/users/:id', function*(next) {
                this.body = "这是用户列表2"
        })
        .get('/error', function*(next) {
                throw 111
                this.body = "这是用户列表3"
        })
app.on("error", function(err, ctx) {
        //https://github.com/koajs/examples/issues/20
        console.log("捕获到错误")
})
app.use(router.routes())
app.use(router.allowedMethods());
// catch all middleware, only land here
// if no other routing rules match
// make sure it is added after everything else
app.use(function*() {

        this.body = 'error! [ ' + this.originalUrl + " ]不存在!"
                // or redirect etc
                // this.redirect('/someotherspot');
});
app.listen(3000);
console.log("已经启动http://localhost:3000/")
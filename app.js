var koa = require('koa');
var path = require('path');
var app = koa();
var http = require("http")

//============设置session==============
app.keys = ['secret', 'key']; //https://github.com/koajs/koa/issues/203
var session = require('koa-session')
app.use(session(app))


//============设置静态资源缓存==============
//处理public目录下的js, css, jpg, png , ttf, woff， eot, otf, svg文件
var staticCache = require('koa-static-cache')
app.use(staticCache(path.join(__dirname, 'public'), {
        maxAge: 365 * 24 * 60 * 60
}))

//============设置etag==============
var conditional = require('koa-conditional-get');
var etag = require('koa-etag');
app.use(conditional());
app.use(etag());
//============req.body==============
//req.body为一个对象,以键值对的形式存放POST请求中的数据
//使用 https://github.com/koajs/bodyparser 模块
//受 https://github.com/stream-utils/raw-body  https://github.com/Raynos/body 所启发
//http://codeforgeek.com/2014/09/handle-get-post-request-express-4/
var bodyParser = require('koa-bodyparser');
app.use(bodyParser());
//============设置日志=============
var log4js = require('log4js');
var loggerName = 'normal';
var logjson = require(path.join(__dirname, "config", "log4js.json"))
app.logger = log4js.configure(logjson);
//============设置视图引擎=============
var render = require('koa-ejs');
var filters = require(path.join(__dirname, "config", "filters"))
render(app, {
        root: path.join(__dirname, 'app', "pages"),
        layout: '../layout/template',
        viewExt: 'html',
        cache: app.env !== "development", //开发环境不进行缓存
        debug: true,
        filters: filters
                // locals: locals,
                // filters: filters
});
//============设置错误处理=============
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
                log4js.getLogger("error").error(err.stack)
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


app.use(function*(next) {
        var req = this.request,
                header = req.header
        browser = header["user-agent"].replace(/\([^)]+\)/g, " ").replace(/\s+/g, " ") //去掉着小括号里面的内容
        log4js.getLogger("normal").info([req.method, req.url, browser].join(" "))
        yield next;
})



//============转为各种请求到对controller#action中去==============
var router = require('koa-router')();
var routes = require(path.join(__dirname, "config", "routes.json"))

var Cache = require(path.join(__dirname, "core", "lru.js"))
        //https://cnodejs.org/topic/4fa94df3b92b05485007fd87 防止撑爆内存,必须限制键值对数量,因此不用普通JS对象
var controllers = new Cache(1024) //缓存所有控制器
Object.keys(routes).forEach(function(key) {

        var methodRule = key.split(" ")
        var method = methodRule[0].toLowerCase()
        var rule = methodRule[1]
        var controllerAction = routes[key].split(" ")
        var scontroller = controllerAction[0]
        var saction = controllerAction[1]
      
        var controller
        var _controller = controllers.get(scontroller)
        if (typeof _controller === "object") {
                controller = _controller
        } else {
                try {
                        var controllerPath = path.join(__dirname, "app", "pages", scontroller, "controller.js")
                        controller = require(controllerPath)
                        controllers.set(scontroller, controller)
                } catch (e) {
                       // log4js.getLogger("error").error(scontroller + " 控制器没有定义")
                }

        }
        if(!controller)
            return
        var action = controller[saction]
        if (typeof action === "function") {
                if (typeof router[method] === "function") {
                        router[method](rule, action)
                } else {
                        log4js.getLogger("error").error(scontroller + "#" + saction + " 对应的路由规则【" + key + "】存在问题")
                }

        } else {
                log4js.getLogger("error").error(scontroller + " 控制器没有定义" + saction + " 方法")
        }

})



app.use(router.routes())
app.use(router.allowedMethods());
app.on("error", function(err, ctx) {
        //https://github.com/koajs/examples/issues/20
        console.log("捕获到错误")
})


app.use(function* pageNotFound(next) {
        yield next;
        if (404 != this.status) return;
        // we need to explicitly set 404 here
        // so that koa doesn't assign 200 on body=
        this.status = 404;
        switch (this.accepts('html', 'json')) {
                case 'html':
                        this.type = 'html';
                        this.body = '<p>Page Not Found</p>';
                        break;
                case 'json':
                        this.body = {
                                message: 'Page Not Found'
                        };
                        break
                default:
                        this.type = 'text';
                        this.body = 'Page Not Found';
        }
});
var port = global.port || 3000
app.listen(port);
console.log("已经启动http://localhost:"+ port)
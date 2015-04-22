#!/usr/bin/env node
var program = require('commander');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp')
var color = require('cli-color')
var spawn = require('child_process').spawn
//var rootPath = __dirname.split(path.sep).slice(0, -1).join(path.sep)
var rootPath = path.resolve(__dirname + '/..')
program
        .version(JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')).version)
console.log(path.join(__dirname, '../package.json') + "!")
//process.chdir(rootPath)
//<xxx>表示这是一个必填参数
//[xxx]表示这是一个可选参数
//[xxx...]表示这是一个可选数组参数
program
        .command('scaffold <rule> <controller> [actions...]')
        .description('创建一个路由规则, 控制器(controller.js), action方法及页面')
        .action(function (rule, controller, actions) {
            //agate scaffold /test2 test2  get#index post#create
            //相当于agate scaffold /test2 test2  index post#create
            var jsonPath = path.join(rootPath, 'config', 'routes.json')
            var json = require(jsonPath)
            var hasNewKey = false
            var newActions = []
            for (var i = 0, action; action = actions[i++]; ) {
                var arr = action.split("#")
                if (arr.length === 1) {
                    arr = ["get", action]
                } else {
                    arr = [arr[0].toLowerCase(), arr[1]]
                }
                var key = arr[0] + " " + rule
                var val = controller + " " + arr[1]
                if (json.hasOwnProperty(key)) {
                    console.error(key + " 已经定义")
                } else {
                    json[key] = val
                    newActions.push(arr[1])
                    hasNewKey = true
                }
            }
            if (hasNewKey) {
                var ret = {}
                //对路由规则进行排序，方便查工
                Object.keys(json).sort().forEach(function (el) {
                    ret[el] = json[el]
                })
                //重写routes.json的内容
                fs.writeFile(jsonPath, JSON.stringify(ret, null, '\t'), function (err) {
                    if (err)
                        throw err
                    console.log('添加新的路由规则成功')
                    console.log(JSON.stringify(ret, null, '\t'))
                })
                //准备要添加action函数
                var scontroller = newActions.map(function (action) {
                    return '\r\nexports.' + action + ' = function *(next) {\r\n' +
                            '\tyield this.render("' + controller + '/' + action + '")\r\n' +
                            '}\r\n'
                }).join("")
                var controllerPath = path.join(rootPath, "app", "pages", controller, "controller.js")
                //确保此目录存在
                mkdirp(path.dirname(controllerPath), function (err) {
                    //在controller.js中添加新action函数
                    fs.writeFile(controllerPath,
                            scontroller, {
                                encoding: "utf8",
                                flag: "a+"
                            },
                    function (err) {
                        if (err)
                            throw err
                        console.log('添加新action成功')
                    })
                    //添加action对应的空页面
                    newActions.forEach(function (action) {
                        fs.writeFile(path.join(rootPath, "app", "pages", controller, action + ".html"),
                                "", {
                                    encoding: "utf8",
                                    flag: "a+"
                                },
                        function () {
                        })
                    })

                })


            }

        }).on('--help', function () {
    console.log('参数:');
    console.log();
    console.log('%s\t  后跟路由规则，如%s，它会添加在config/routes.json下',
            color.bold('rule'), color.cyan('page\\:pageId'));
    console.log('%s后跟控制器的名字，不能有非法字符, 如topic', color.bold('controller'))
    console.log('它会在app/pages目录下建topic目录，再建一个controller.js');
    console.log('%s\t  后面重复跟N个%s ，如%s', color.bold('actions'), color.green('请求名#action名'),
            color.cyan('get#index get#about post#create'));
    console.log('此外get请求名默认可省略，相当于%s 有多少action就会建多少个相名空页面',
            color.cyan('index about post#create'));
    console.log('一个完整的命令如下');
    console.log(color.cyan('agate scaffold page\\:pageId topic index about post#create'));
    console.log();
});




program
        .command('start [port] [url] [env]')
        .description('启动服务器, 并通过默认浏览器打开该面')
        .action(function (port, url, env) {
            port = isFinite(port) ? parseFloat(port) : 3000
            url = /http|localhost/.test(url) ? url : "http://localhost:"
            var map = {
                "prod": "production",
                "production": "production",
                "dev": "development",
                "development": "development",
                "test": "test"
            }
            env = map[env] || "development"
            //process.execPath 相当于 "C:\\Program Files\\nodejs\\node.exe"
            //http://www.cnblogs.com/xiziyin/p/3578905.html
            switch (env) {
                case "development": //热启动
                    spawn(process.execPath,
                            [path.join(rootPath, "node_modules/nodemon/bin/nodemon"), "--harmony", path.join(rootPath, 'app.js'), "localhost", port, "port=" + port, "url=" + url], {
                        stdio: 'inherit',
                        cwd: rootPath
                    })
                    break
                case  "test":
                    spawn(process.execPath,
                            ["--harmony", path.join(rootPath, 'server.js'), "port=" + port, "url=" + url], {
                        stdio: 'inherit',
                        cwd: rootPath
                    })
                    break
                case "production": //多线程
                    spawn(process.execPath,
                            ["--harmony", path.join(rootPath, 'server.js'), "port=" + port, "url=" + url], {
                        stdio: 'inherit',
                        cwd: rootPath
                    })
                    break
            }

            var open = require("open");
            open(url + port);
        }).on('--help', function () {
    console.log('参数:')
    console.log()
    console.log('%s\t  端口号, 默认是%f', color.bold('port'), color.cyan('4000'));
    console.log('%s\t  URL地址, 必须是http/https开头或者是localhost, 默认是http://localhost', color.bold('url'))
    console.log('%s\t  工作环境, 可以是test, dev, prod, development, production, 默认是development', color.bold('env'))
    console.log('一个完整的命令如下');
    console.log(color.cyan('agate start 8888 "" prod'))
    console.log()
    console.log("    在开发环境中，是通过nodemon进行文件监控，如果文件发动改动，会自动重启服务器")
    console.log("    在测试与生产环境中，是cluster模块启动多个线程（线程数视CPU核心决定），如果服务器挂掉，会自动重启服务器");
    console.log("但在10秒内连续重启60次，就认为是严重故障，不再重启了");
})
program
        .command('pm2')
        .description('通过pm2模块执行APP')
        .action(function () {

            //https://github.com/Unitech/PM2/issues/887
            spawn(process.execPath,
                    [path.join(rootPath, "node_modules/pm2/bin/pm2"), "start", path.join(rootPath, 'config', "pm2.json")], {
                stdio: 'inherit',
                cwd: rootPath
            })
        })

//        program
//        .command('stop [port]')
//        .description('关掉')
//        .action(function (port) {
//            
//            http.request({
//                host:host + ':' + port,
//                method: get
//            })
//
//          
//        })

program.parse(process.argv)


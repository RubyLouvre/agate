#!/usr/bin/env node
var program = require('commander');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp')
var rootPath = __dirname.split(path.sep).slice(0, -1).join(path.sep)
program
        .version('0.0.1')
//    .allowUnknownOption()

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
    console.log('\t例子:');
    console.log();
    console.log('    $ deploy exec sequential');
    console.log('    $ deploy exec async');
    console.log();
});
program.parse(process.argv)
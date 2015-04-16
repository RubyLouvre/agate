#!/usr/bin/env node
var program = require('commander');
var path = require('path');
var fs = require('fs');
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
            //scaffold / home get#index post#create 
            var jsonPath = path.join(rootPath, 'config', 'routes.json')
            var json = require( jsonPath )
            var hasNewKey = false
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
                    hasNewKey = true
                }
            }
            if (hasNewKey) {
                var ret = {}
                Object.keys(json).sort().forEach(function (el) {
                    ret[el] = json[el]
                })

                fs.writeFile(jsonPath, JSON.stringify(ret, null, '\t'), function (err) {
                    if (err)
                        throw err
                    console.log('成功为routes.json添加新的路由规则')
                    console.log(JSON.stringify(ret, null, '\t'))
                })


//                var writeStream = fs.createWriteStream(path.join('..', 'config', 'routes.json'), {flags: 'w'});
//                var readStream = new MyReadStream();
//                readStream.pipe(writeStream);
//                writeStream.on('close', function () {
//                    console.log('All done!');
//                });

            }

            //  console.log(a, b, c, d)
        }).on('--help', function () {
    console.log('\t例子:');
    console.log();
    console.log('    $ deploy exec sequential');
    console.log('    $ deploy exec async');
    console.log();
});

program.parse(process.argv)
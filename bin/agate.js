#!/usr/bin/env node
var program = require('commander');
var path = require('path');
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
            var json = require(path.join('..', 'config', 'routes.json'))
            for (var i = 0, action; action = actions[i++]; ) {
                var arr = action.split("#")
                if (arr.length === 1) {
                    arr = ["get", action]
                } else {
                    arr = [arr[0].toLowerCase(), arr[1]]
                }
                var key = arr[0]+" "+ rule
                var val = controller +" "+arr[1]
                if(json.hasOwnProperty(key)){
                    console.error(key +" 已经定义")
                }else{
                    json[key] = val
                }
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
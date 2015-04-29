var koa = require('koa');  
var Readable = require('stream').Readable
var koa = require('koa');  
var thunkify = require("thunkify")
var fs = require("fs")
var app = koa();

app.use(function *(){  
     this.type = 'text/html'
     var stream = this.body = new Readable()
     stream._read = function () {}
     var readFile = thunkify(fs.readFile);  
     var a = yield [readFile('./start.html',"utf8"),readFile('./end.html',"utf8")];   
     stream.push(a[0] + '<br>');
     setTimeout(function(){
        stream.push('第二行<br>');
     }, 1200)
     setTimeout(function(){
        stream.push(a[1] + '最后一行<br>');
        stream.push(null)
    }, 2200)
});

app.listen(3000);  
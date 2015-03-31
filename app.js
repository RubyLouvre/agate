
 
 
var koa = require('koa');
var render = require('koa-ejs');
var path = require('path');
var app = koa();
var http = require("http")
var router = require('koa-router')();


render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true
 // locals: locals,
 // filters: filters
});

router
  .get('/', function *(next) {
     //this里包含  request, response, app, req, res, onerror, originalUrl, cookies, accept, matched, captures, params, route
     // this.body = 'Hello World!';
     yield this.render('home', {
         h2: "这是首页"
     })
  })
  .get('/users', function *(next) {
     var users = ["司徒正美", "清风火羽", "古道瘦马"]
     console.log(users)
     yield this.render('list', {
         layout: "template2",
         h2: "这是用户列表页",
         users: users
     })
  })
  .get('/users/:id', function *(next) {
     this.body = "这是用户列表2"
  })
  .get('/error', function *(next) {
     throw "这是错误"
     this.body = "这是用户列表3"
  })
  app.on("error", function (e){
      //https://github.com/koajs/examples/issues/20
        log.error('server error', err, ctx);
  })
app.use(router.routes())
app.use(router.allowedMethods());
//错误处理
//https://github.com/koajs/onerror/blob/master/index.js
function * errors (next) {
  try {
    yield next;
  } catch (err) {
      console.error("err.stack");
    
    // 取得行号
  	var line = err.stack.split('\n')[1];

  	// parse file path and line
  	var result = /at\s(.+\s)?\(?(.+)\:([0-9]+)\:[0-9]+/.exec(line);
  	var path = result[2];
  	var row = +result[3];

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
  		line: row,
  		stack: err.stack
  	});
  }
 }
  app.use(errors)
// catch all middleware, only land here
// if no other routing rules match
// make sure it is added after everything else
app.use(function *(){

  this.body = 'error! [ '+ this.originalUrl +" ]不存在!"
  // or redirect etc
  // this.redirect('/someotherspot');
});

app.listen(3000);
console.log("已经启动http://localhost:3000/")
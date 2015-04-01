var koa = require('koa');

var path = require('path');
var app = koa();
var http = require("http")

var router = require('koa-router')();
var log4js = require('log4js');
var render = require('koa-ejs');
render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'template',
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
   log4js.getLogger("normal").info([ req.ip, req.method, req.url, header['user-agent']].join(" "))
   yield next;
})

//this.env = process.env.NODE_ENV || 'development';

router
  .get('/', function*(next) {
    //this里包含  request, response, app, req, res, onerror, originalUrl, cookies, accept, matched, captures, params, route
    // this.body = 'Hello World!';
    yield this.render('home', {
      h2: "这是首页"
    })
  })
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
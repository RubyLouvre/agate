
 
 
var koa = require('koa');
var render = require('koa-ejs');
var path = require('path');
var app = koa();
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

app.use(router.routes())
app.use(router.allowedMethods());

// catch all middleware, only land here
// if no other routing rules match
// make sure it is added after everything else
app.use(function *(){

  this.body = 'Invalid URL!!!';
  // or redirect etc
  // this.redirect('/someotherspot');
});

app.listen(3000);
console.log("已经启动http://localhost:3000/")
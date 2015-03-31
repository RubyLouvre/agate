var koa = require('koa');
var app = koa();
var router = require('koa-router')();

router
  .get('/', function *(next) {
    this.body = 'Hello World!';
  })
  .get('/users', function *(next) {
     this.body = "这是用户列表"
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
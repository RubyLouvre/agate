

node0.12.1还没有默认开启generator ,如果你有一个app.js,以前是用node app运行它,现在想玩koa,则需要node --harmony app

express需要历史悠久,但版本众多,许多模块可能只运行于某一版本中,查起来非常麻烦,并且许多依赖都独立出去, 一盘散沙似的，不方便学习。

koa代表着历史的前进方向，使用更方便。是存在N多异步处理的场合，koa的优势就一下子出来，这对于只会写业务代码的小白来说，这简直是救赎。
koa的资料也比较集中。

相关学习资料

package.json使用
http://javascript.ruanyifeng.com/nodejs/packagejson.html
http://www.infoq.com/cn/articles/msh-using-npm-manage-node.js-dependence/

监控
http://se77en.cc/2013/06/27/goodbye-node-forever-hello-pm2-translation/

http://segmentfault.com/a/1190000002394571

当我们修改了业务代码，让node服务器自动重启，只监听某一两个文件夹的文件改动或新增删除
https://www.npmjs.com/package/nodemon
https://www.npmjs.com/package/pm2


ejs使用
___________________________
全局配置

```javascript
var koa = require('koa');
var render = require('koa-ejs');
var path = require('path');
var app = koa();
render(app, {
  root: path.join(__dirname, 'view'), //这是所有模板的目录
  layout: 'template',  //这是默认的layout
  viewExt: 'html',     //这是模板的后缀名,只有这类文件才能被匹配当成模板使用
  cache: false,        //是否缓存,开发时为false,上线应当设为flase
  debug: true         
 // locals: locals,   //全局函数
 // filters: filters  //全局过滤器
});
```
render方法使用
```
ejs.render(str, options);  //模板名, 配置对象,里面可以重设上面参数
```
一个简单例子,某个action的代码
```
  router.get('/users', function *(next) {
     var users = ["司徒正美", "清风火羽", "古道瘦马"]
     console.log(users)
     yield this.render('list', {
         layout: "template2",
         h2: "这是用户列表页",
         users: users
     })
  })
```
详见 http://blog.csdn.net/zhangxin09/article/details/18409119



对model的字段进行格式化，验证
https://github.com/Textalk/angular-schema-form
详看 https://github.com/gcanti/tcomb-form-native https://github.com/joshfire/jsonform





node0.12.1还没有默认开启generator ,如果你有一个app.js,以前是用node app运行它,现在想玩koa,则需要node --harmony app

express需要历史悠久,但版本众多,许多模块可能只运行于某一版本中,查起来非常麻烦,并且许多依赖都独立出去, 一盘散沙似的，不方便学习。


koa是基于generator与co之上的新一代的中间件框架, 代表着历史的前进方向。虽然受限于generator的实现程度。但是它的优势却不容小觑。

1. 有了koa，我们可以很好的解决回调的问题。只要yield就行，还可以直接用try来捕获异常
2. koa会自动帮你改造node的req，res对象，省去你很多工作。再也不需要每个res.end都要写一大堆返回状态了，
也不需要各种检测错误了，也不需要每次都用finish来确保程序正常关闭了。
3. 内置了很多以前express的第三方基础库，更加方便。这样你写中间件的时候没必要到处安装依赖库。

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

pm2的使用
_______________________
如果你在启动时报以下错误
```
D:\agate>pm2 start app --node-args="--harmony"
fs.js:751
  return binding.mkdir(pathModule._makeLong(path),
                 ^
Error: ENOENT, no such file or directory 'D:\Users\qincheng.zhong.QUNARSERVERS\.
pm2'
```
那么你应该建立`D:\Users\qincheng.zhong.QUNARSERVERS\.pm2`目录就可以了
```
D:\agate>mkdir D:\Users\qincheng.zhong.QUNARSERVERS\.pm2

D:\agate>dir D:\Users\qincheng.zhong.QUNARSERVERS\.pm2
```
https://doesnotscale.com/deploying-node-js-with-pm2-and-nginx/
然后运行`pm2 start app --node-args="--harmony"`（你不需要再运行node app --harmony） 
![image](https://cloud.githubusercontent.com/assets/190846/7040248/8ed8d2ca-ddff-11e4-8868-2c0c16b95549.png)




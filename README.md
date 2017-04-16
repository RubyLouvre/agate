agate是去哪儿网酒店前端架构组推出一个nodejs框架，能帮你迅速搭好架子。

主要依赖技术
__________________________
koa + nodemon + log4js + ...

<b>为什么使用koa</b>  ? nodejs三大框架express, koa, hapi， 目前国内最流行的是前两者。

express需要历史悠久,但版本众多,许多模块可能只运行于某一版本中,查起来非常麻烦,并且许多依赖都独立出去, 一盘散沙似的，不方便学习。


koa是基于generator与co之上的新一代的中间件框架, 代表着历史的前进方向。虽然受限于generator的实现程度。但是它的优势却不容小觑。

1. 有了koa，我们可以很好的解决回调的问题。只要yield就行，还可以直接用try来捕获异常
2. koa会自动帮你改造node的req，res对象，省去你很多工作。再也不需要每个res.end都要写一大堆返回状态了，
也不需要各种检测错误了，也不需要每次都用finish来确保程序正常关闭了。
3. 内置了很多以前express的第三方基础库，更加方便。这样你写中间件的时候没必要到处安装依赖库。

目录结构
```
│
├──agate.js
├──server.js
├──app
│　　├──layouts
│    │    └──layout1.html
│　　└──pages
│           ├──home
│           │     ├──controller.js
│           │     └──index.html
│           └──xxx
│                  ├──controller.js
│                  └──index.html
├──config
│　　 ├──filters.js
│　　 ├──log4js.js
│　　 └──routes.json
├──core
│　　 └──lur.js
├──bin
│　 　└──agate.js
├──public
│     └──favicon.ico
├──logs
│     └──favicon.ico       
├──node_modules
└──package.json
```  
http://www.veryhuo.com/a/view/39755.html


## 启动命令
```
agate start 3000 '' prod
agate start 3000 '' test
agate start 3000 '' dev
```

## 脚手架命令
```javascript
node --harmony agate 
```

## 直接启动命令
```javascript
agate agate scaffold /test2 test2  index post#create
```


在开发环境使用 nodemon, 在生产环境使用pm2
//http://ourjs.com/detail/52456ae04cd0e14503000009



<b>为什么使用log4js</b>  ? 其前身是log4j， 历史悠久， 质量有保证， 并且提供各种日志打印方式及保存方案。

<p>扼要地说, 在app里面写业务代码, 在config里写各种配置,在public里放静态页面。</p>
<p>当你下载好本框架后，直接npm install就能安装好各种依赖，
    然后进入config目录，使用 pm2 start processes.json， 于是服务器就起来了。</p>
<p>app是写业务代码， 里面有两个目录pages与layout， pages下面应该是一个个目录，每个目录代表一个页面。
   每个目录有一个controller.js（它就是MVC中的C），C里面以这样的形式组织代码：
</p>
```javascript
exports.index  = function*(next) {
    yield this.render("doc-session/index",{xxx: "111"})
}

exports.list  = function*(next) {
    yield this.render("doc-session/list")
}

exports.create  = function*(next) {
    yield this.render("doc-session/create")
}

exports.delete  = function*(next) {
    yield this.render("doc-session/delete")
}

```
<p>这些index, list, create, delete方法就是<b>controller</b>中的<b>action</b>，一个action应该对应页面上的一个HTTP请求，它用于响应请求返回数据或页面，
    或者转交其他action进来处理（用术语来说就是重定向）。如果是返回页面，就使用this.render方法，它有两个参数，
    一个是指定当前的子页面（子页面要结合layout才能变成一个完整的页面），第一个参数是各种数据及这个页面的其他配置。 </p>
<p>现在我们有4个action，那么理应在该目录下建4个页面(MVC中的V)，我们现在是使用ejs模块。详见下面模板引擎这一节</p>
<p>
    页面配置已经写app.js中了,没有把握请不要改动它
</p>
```javascript
var render = require('koa-ejs');
render(app, {
    root: path.join(__dirname, 'app', "pages"), //所有页面模板所在的位置
    layout: '../layout/template',    //默认所有页面都使用这个layout
    viewExt: 'html',             
    cache: app.env !== "development" ,//开发环境不进行缓存
    debug: true
        // locals: locals,
        // filters: filters
});
```
<p>如果我们有许多业务逻辑，那么请在对应目录下添加对应JS文件（MVC中的C），然后在action中调用</p>
<p>有了MVC了， 那么我们的请求如何才能到达这里呢，那就需要路由系统了。路由系统会根据config下的routes.js定义的路由规则进行定义
定义到对应的controller下的某action下。一个完整的路由规则如下：
</p>
```javascript
routes["get /xxxx"] = {
    controller: "xxx",
    action: "index"
}
```

<p>我们写代码时，其操作过程是反过来的，首先是在routes.js下添加路由规则，然后在pages目录下建议你的页面目录，下面建立controller.js
然后里面有多少个请求，就建议多少个action,然后再建立对应的页面及模型JS， 如果不满意原layout页面，可以再建新的layout，
然后通过this.render方法的第2个参数指定。
</p>
<p>这样就over了。什么日志， session, cookie, 多线程并发都为你准备好了。</p>

更多教程，当你启动本工程后，首页就是教程首页。然后你再将routes中的路由规则重设首页，添加你自己的页面！



/* 
 nodemon 适合开发使用， 正式环境使用forever
 
http://snoopyxdy.blog.163.com/blog/static/601174402013520103319858/
http://www.infoq.com/cn/articles/nodejs-cluster-round-robin-load-balancing
 */

var cluster = require('cluster')
var os = require('os')
var http = require('http')
var workers = {};
process.on('uncautchException', function (err) {
    console.error(err.stack)
    //do nothing
});

var numCPUs = os.cpus().length * 2
console.log("CPU " + numCPUs)

if (cluster.isMaster) {
    // Master:
    // Let's fork as many workers as you have CPU cores

    for (var i = 0; i < numCPUs; i++) {
        var w = cluster.fork()
        workers[w.id] = {
            crashCount: 0,
            worker: w,
            lastTime: new Date()
        }

    }

    http.createServer(function (req, res) {
        res.writeHead(200);
        if ('check your bussiness' === 'check your bussiness') {
            res.end("重启成功\n");
            setTimeout(function () {
                for(var i in workers){
                    workers[i].worker.disconnect()
                }

                process.exit(0);
            }, 0);
        } else {
            res.end("重启失败，因为wulawulaWula\n");
        }
    }).listen(7543); //这个端口是个后门，不应该被他人访问

    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });

    cluster.on('disconnect', function (worker) {
        var w = workers[worker.id]
        w.crashCount++
        var now = new Date()
        if (now - w.lastTime > 10 * 60 * 1000) {
            w.crashCount = 0
            w.lastTime = now
        }
        if (w.crashCount > 60) {
            console.error('panic')
            return process.exit(1)
        }
        delete workers[worker.id]
        var newWorker = cluster.fork() //respawn
        workers[newWorker.id] = {
            crashCount: 0,
            worker: newWorker,
            lastTime: new Date()
        }
    });
} else {
    // Worker:
    // Let's spawn a HTTP server
    // (Workers can share any TCP connection.
    //  In this case its a HTTP server)
    require("./worker.js")

}



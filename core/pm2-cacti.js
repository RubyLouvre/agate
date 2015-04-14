var http  = require('http');
var url = require('url');
var logger = require('log4js').getLogger('pm2-cacti');
var TimeBucket = require('counter-by-time-bucket');

var PORT = 9527;
var DELAY_CHECK = 5 * 1000;
var INTERVAL = 6 * 1000;



var isReady = false;
var _reconnectingHandler;
var timeBucket = new TimeBucket(60000,1000);
var keyMap = {};


/**
 * configure
 */
exports.configure = function(config) {

};

/**
 * launch bus
 */
exports.init = function() {

    var pm2 = require('pm2');

    logger.info('Connecting');

    pm2.launchBus(function(err, bus) {

        if(err) {

        }

        logger.info('Connected to pm2');

        bus.on('*', function(event, data) {

            var name = event,
                processData = data.data,
                processPid = data.process && data.process.pm_id;

            if( name === 'log:out')
                return;

            if(processPid){
                if( processData && typeof processData === 'number'){
                    timeBucket.put(name,processData);
                    keyMap[name] = 1;
                    logger.info('Receive from PM2ID:%s[%s]+%s',processPid,name,processData);
                }else{
                    logger.info('Receive from PM2ID:%s[%s]',processPid,name);
                }
            }else{
                try{
                    logger.info('Received : [%s]%s',name,JSON.stringify(data||{}).substr(0,20) + "...");
                }catch(e){
                    logger.info('Received : [%s]',name);
                }
            }

        });

        bus.sock.on('reconnect attempt', function() {
            isReady = false;

            if( !_reconnectingHandler ){
                _reconnectingHandler = setTimeout(function(){
                    _reconnectingHandler = null;
                },1000);
                logger.info("Reconnecting");
            }
        }).on('connect', function() {
            logger.info('Connected to pm2');
        }).on('closed',function(){
            logger.info('closed');
        }).on('close',function(){
            logger.info('close');
        });

    });

    //getMonitorData

    setTimeout(function() {
        console.log("getMonitorData", pm2.getMonitorData())
    })

};



/*
ipm2.on('ready',function(){
    logger.info('Connected to pm2');

    isReady = true;

    ipm2.bus.on('*', function(event, data){

        var name = event,
            processData = data.data,
            processPid = data.process && data.process.pm_id;

        if( name === 'log:out')
            return;

        if(processPid){
            if( processData && typeof processData === 'number'){
                timeBucket.put(name,processData);
                keyMap[name] = 1;
                logger.info('Receive from PM2ID:%s[%s]+%s',processPid,name,processData);
            }else{
                logger.info('Receive from PM2ID:%s[%s]',processPid,name);
            }
        }else{
            try{
                logger.info('Received : [%s]%s',name,JSON.stringify(data||{}).substr(0,20) + "...");
            }catch(e){
                logger.info('Received : [%s]',name);
            }
        }
    });

}).on('reconnecting',function(){
    isReady = false;

    if( _reconnectingHandler ){
        return;
    }else{
        _reconnectingHandler = setTimeout(function(){
            _reconnectingHandler = null;
        },1000);
        logger.info("Reconnecting");
    }
}).on('closed',function(){
    logger.info('closed');
}).on('close',function(){
    logger.info('close');
});






*/
 /*L_ 上次
 S_ 输出



var VALUES = {
    L_RESTART_TIME : -1,
    L_UNSTABLE_RESTART_TIME : -1,

    S_RESTART_TIME : -1,
    S_UNSTABLE_RESTART_TIME : -1,
    S_ONLINE : -1,
    S_LAST_UPDATE : -1,
    S_MEMORY : -1
};

function check() {


    if(!isReady || !ipm2.rpc ){
        return;
    }

    ipm2.rpc.getMonitorData({}, function(err, list) {

        if(!err){

            var online = 0,
                restart_time = 0,
                unstable_restarts = 0,
                memory = 0;

            list.forEach(function(proc){
                //I_RESTART_TIME

                if(proc.pm2_env.status === 'online')
                    online++;

                unstable_restarts += proc.pm2_env.unstable_restarts;
                restart_time += proc.pm2_env.restart_time;
                memory += proc.monit.memory;

            });


            VALUES.S_ONLINE = online;

            VALUES.S_MEMORY = memory;

            if( VALUES.L_RESTART_TIME === -1 ){
                VALUES.S_RESTART_TIME = 0;
            }else{
                VALUES.S_RESTART_TIME = restart_time - VALUES.L_RESTART_TIME;
            }

            VALUES.L_RESTART_TIME = restart_time;


            if( VALUES.L_UNSTABLE_RESTART_TIME === -1 ){
                VALUES.S_UNSTABLE_RESTART_TIME = 0;
            }else{
                VALUES.S_UNSTABLE_RESTART_TIME = unstable_restarts - VALUES.L_UNSTABLE_RESTART_TIME;
            }

            VALUES.L_UNSTABLE_RESTART_TIME = unstable_restarts;

            VALUES.S_LAST_UPDATE = new Date().getTime();


            for( var x in VALUES ){
                if( VALUES[x] < 0 )
                    VALUES[x] = 0;
            }

        }
    });



}

//Delay check to make sure all processes are ready
setTimeout( check , DELAY_CHECK );
setInterval( check , INTERVAL );*/

/*http.createServer(function (req, res) {

    var path = url.parse(req.url).pathname;
    if( path === '/getMonitorData' ){
        res.writeHead(200, {'Content-Type': 'text/plain'});


        if(isReady){
            for( var x in VALUES ){
                var m = x.match(/^([S])_(.+)$/);

                if(m){
                    res.write(m[2] + "=" + VALUES[x] + "\n");
                }
            }

            for( var x in keyMap ){

                if(m){
                    res.write(x + "=" + timeBucket.get(x) + "\n");
                }
            }
        }

        return res.end();
    }else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        return res.end("Error 404");
    }

}).listen(PORT);*/

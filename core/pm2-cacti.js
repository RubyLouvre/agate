var logger = require('log4js').getLogger('pm2-cacti'),
    pm2 = require('pm2'),
    path = require('path'),
    merge = require('merge'),
    url = require('url'),
    request = require('request');

var config = merge({
        INTERVAL: 60 * 1000,
        prefix: "",
        //for url format
        urlObj: {
            host: "",
            protocol: "http",
            pathname: ""
        },
        //names which send to cacti monitor
        qsName: [
            "RESTART_TIME",               //restart counts
            "UNSTABLE_RESTART_TIME",      //unstable restart counts
            "ONLINE",                     //online workers counts
            "LAST_UPDATE",
            "MEMORY"
        ]
    }, require(path.join(__dirname, "../config", "pm2-cacti.json"))),
    isReady = false,
    _reconnectingHandler,
    keyMap = {},
    //L Latest
    //S Current
    VALUES = {
        L_RESTART_TIME : -1,
        L_UNSTABLE_RESTART_TIME : -1,

        S_RESTART_TIME : -1,
        S_UNSTABLE_RESTART_TIME : -1,
        S_ONLINE : -1,
        S_LAST_UPDATE : -1,
        S_MEMORY : -1
    };


//============启动监控==============
//bus
busLaunch();

//monitor
setInterval(function() {
    pm2.connect(check)
}, config.INTERVAL)

/**
 * bus launch
 * use pm2 bus insteadof pm2-interface
 * https://github.com/Unitech/PM2/blob/master/doc/PROGRAMMATIC.md
 */

function busLaunch() {

    logger.info('Connecting to pm2');

    pm2.launchBus(function(err, bus) {

        logger.info('Connected to pm2');

        bus.on('*', function(event, data) {

            var name = event,
                processData = data.data,
                processPid = data.process && data.process.pm_id;

            if( name === 'log:out')
                return;

            if(processPid){
                if( processData && typeof processData === 'number'){
                    keyMap[name] = 1;
                    logger.info('Receive from PM2ID:%s[%s]+%s',processPid,name,processData);
                }else if( name === 'process:event' ){
                    logger.info('Receive from PM2ID:%s[process:event:%s]',processPid,data.event);
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
}

/**
 * get pm2 monitorData && send a request to cacti monitor
 */
function check() {

    pm2.list(function(err, list) {
        if(!err) {
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

                var m = x.match(/^([S])_(.+)$/);

                if(m && config.qsName.indexOf(m[2]) > -1 ){
                    makeRequest(m[2], VALUES[x]);
                }
            }

        } else {
            //pm2 CLI
            //return cb ? cb({msg:err}) : exitCli(cst.ERROR_EXIT);
            logger.error(err.msg);
        }
    })
}

//send monitor request
//format likes http://m.ued.qunar.com/monitor/log?code=hotel_detail_bktool_render&time=1024
function makeRequest(name, value) {
    var qsObj = {};
    qsObj[config.prefix + "-" +  name] = value;

    request({
        url: url.format(config.urlObj),
        qs: qsObj
    });
}





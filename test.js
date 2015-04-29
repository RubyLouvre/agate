var thunkify = require('thunkify');  
var co = require('./co');  
var fs = require('fs');  


var readFile = thunkify(fs.readFile);  

co(function *() {  
  var now = new Date - 0
   var a = yield readFile('./readme.md');   
   var b = yield readFile('./fwp_core.zip');  
   var c = yield readFile('./package.json');  
  console.log(a.length, b.length, c.length)
  console.log(new Date - now)
})
var co = require("./co")
var compose = require("./compose")
var thunkify = require("thunkify")
var fs = require("fs")
function delay(time) {
    console.log(time+"!!!!!!!!!!!")
  return function(fn) {
    setTimeout(function() {
         console.log(time+"---------")
      fn()
    }, time)
  }
}

console.time(1)
co(function* () {
  yield delay(200)
  yield delay(1000)
  yield delay(500)
}).then(function() {
  console.timeEnd(1) // print 1: 1702.000ms 
})
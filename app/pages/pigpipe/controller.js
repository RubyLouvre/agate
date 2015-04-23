
exports.index = function *(next) {
    
    var ctx = this
 //   setTimeout(function(){
       ctx.res.write("<html><body><div>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div><script>console.log(new  Date -0)</script>")
  //  }, 1000)
  
    setTimeout(function(){
        ctx.res.write("<div>4444422222222222</div><script>console.log(new  Date -0)</script></body></html>")
      //  ctx.res.end()
    }, 400)
      setTimeout(function(){
        ctx.res.write("<div>8888888888888888</div><script>console.log(new  Date -0)</script></body></html>")
        ctx.res.end()
    }, 700)
	//yield this.render("pigpipe/index")
}

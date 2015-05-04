var path = require("path")
exports.index = function * (next) {
    var BigPipe = require("bigpipe")
    var b = new BigPipe(4)
    var layout = app.getLayout("template-bigpipe.html")
    this.body = b.stream
    this.type = "html"
 
    b.begin(layout)
    
    var end = BigPipe.heredoc(function(){
        /*
      <%scripts.forEach(function(script) {%>
                 <script type="text/javascript" src="<%=: script|qzzUrl %>"></script>
             <%})%>
         </body>
       </html>
         */
    })
    b.end(end)
    b.flush(path.join(__dirname, "./index.html"), 0)
    b.flush(path.join(__dirname, "./left.html"), 1)
    setTimeout(function () {
        b.flush(path.join(__dirname, "./middle.html"), 2)
    }, 1000)
    b.flush(path.join(__dirname, "./right.html"), 3)
//https://www.ibm.com/developerworks/cn/java/j-lo-bigpipe/
}
exports.login = function *(next) {
    if (this.request.method == 'POST') {
      var body = this.request.body
       yield this.render("doc-section/user",{
           username: body.username,
           password: body.password
       })
  }else{
       yield this.render("doc-section/index")
  }
  
}

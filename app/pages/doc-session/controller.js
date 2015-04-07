exports.login = function*(next) {
  var username = this.session.username

  if (username) {
    console.log("33333333333333333"+username)
    this.redirect("/user")
  } else if (this.method == 'POST') {
    var body = this.request.body
    this.session.username = body.username
    this.redirect("/user")
  } else {
    yield this.render("doc-session/index")
  }
}


exports.user = function*(next) {
    console.log("进")
    yield this.render("doc-session/user", {
      username: this.session.username
    })

}

exports.other = function*(next) {
  yield  exports.user
}


exports.logout = function*(next) {
  delete this.session.username
  this.redirect("/login")
}
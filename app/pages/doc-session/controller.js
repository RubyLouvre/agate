exports.login = function*(next) {
  var username = this.session.username

  if (username) {
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
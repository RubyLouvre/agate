exports.login = function * (next) {
    var username = this.session.username
    if (username) {
        yield this.render("doc-session/user", {
            username: username
        })
    } else if (this.request.method == 'POST') {
        var body = this.request.body
        try{
        this.session.username = body.username
    }catch(e){
        console.error(e)
    }
        yield this.render("doc-session/user", {
            username: body.username
        })
    } else {
        yield this.render("doc-session/index")
    }
}

exports.other = function * (next) {
    var username = this.session.username
    
    if (username) {
        yield this.render("doc-session/other", {
            username: username
        })
    } else {
        yield this.render("doc-session/index")
    }
}
exports.logout = function * (next) {
    delete this.session.username
     yield this.render("doc-session/index")
}
# concat-regexp
concat-regexp is a function that takes a series of regular expressions (as String and/or RegExp objects) and returns them in concatenated form.

[![Build status](https://travis-ci.org/michaelrhodes/concat-regexp.png?branch=master)](https://travis-ci.org/michaelrhodes/concat-regexp)

[![Browser support](https://ci.testling.com/michaelrhodes/concat-regexp.png)](https://ci.testling.com/michaelrhodes/concat-regexp)

## Install
```sh
$ npm install concat-regexp
```

### Example
``` js
var concat = require('concat-regexp')

var username = 'alice'
concat(/^\/users\//, username, /\/?/, RegExp('$', 'i'))
// => /^\/users\/alice\/?$/i
```

### License
[MIT](http://opensource.org/licenses/MIT)

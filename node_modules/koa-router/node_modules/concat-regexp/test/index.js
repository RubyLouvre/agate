var run = require('tape')
var escape = require('escape-string-regexp')
var concat = require('../')

run('it combines string and regexp objects', function(test) {
  var expected = /([a-z0-9]{12,16})[f-x]{2}/
  var result = concat(
    /([a-z0-9]{12,16})/, '[f-x]{2}'
  )

  test.equal(
    result.toString(),
    expected.toString(),
    expected.toString()
  )
  test.end()
})

run('it adds modifiers', function(test) {
  var examples = [
    { input: concat('^', /[a-z]{2}$/, 'i'), output: /^[a-z]{2}$/i },
    { input: concat(/^[a-z]{2}/, /$/i), output: /^[a-z]{2}$/i },
    { input: concat(escape('example.com')), output: /example\.com/ },
    { input: concat(escape('example.org')), output: /example\.org/ },
    { input: concat(/a/i, 'g'), output: /a/ig }
  ]

  examples.forEach(function(example) {
    test.equal(
      example.input.toString(),
      example.output.toString(),
      example.output.toString()
    )
  })

  test.end()
})

run('it doesn’t treat forward slashes in strings as pattern boundaries', function(test) {
  test.deepEqual(
    concat('', '/a/').source,
    '/a/',
    '/a/'
  )
    
  test.notOk(
    concat('', '/a/i').test('/A/'),
    'and it avoids false-positive modifiers'
  )

  test.ok(
    concat('', '/a/', 'i').test('/A/'),
    'and it avoids false-positive modifiers'
  )

  test.end()
})

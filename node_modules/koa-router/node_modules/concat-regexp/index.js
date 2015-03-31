var slice = Array.prototype.slice
var boundary = /(^\/|\/$)/
var modifier = /(^|\/)([migy]+)$/

module.exports = function() {
  var pieces = slice.call(arguments)
  var regexp = ''
  var modifiers = ''

  var piece
  var isRegExp
  var i = -1
  var last = pieces.length - 1

  while (i++ < last) {
    // Be kind, tolerate undefined
    if (pieces[i] === undefined) {
      continue 
    }

    isRegExp = pieces[i] instanceof RegExp

    piece = isRegExp ?
      pieces[i].source :
      pieces[i].toString()

    // Strip modifiers
    regexp += isRegExp || !boundary.test(piece) ?
      piece.replace(modifier, '$1') :
      piece

    // Set modifiers
    if (!isRegExp && boundary.test(pieces[i])) {
      continue
    }

    modifiers += (pieces[i].toString().match(modifier) || [])
      .slice(2)
      .join('')
  }

  return RegExp(regexp, modifiers)
}

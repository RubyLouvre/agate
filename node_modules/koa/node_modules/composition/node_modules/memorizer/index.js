
module.exports = function (object, property, getter) {
  Object.defineProperty(object, property, {
    get: function () {
      return this[property] = getter.call(this)
    },
    set: function (val) {
      Object.defineProperty(this, property, {
        value: val,
        configurable: true,
        writable: true
      })
    },
    configurable: true,
  })
  return object
}

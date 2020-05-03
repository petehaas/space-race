var spacex = require('./lib/spacex.js')
module.exports.function = function getInfo ($vivContext) {
  return spacex.info()
}

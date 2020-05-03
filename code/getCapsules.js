var spacex = require('./lib/spacex.js')
module.exports.function = function getCapsules (capsuleId,$vivContext) {
  return spacex.capsules(capsuleId)
}

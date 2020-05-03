var spacex = require('./lib/spacex')

module.exports.function = function getPayloads (payloadId,$vivContext) {
spacex.ships()
  return spacex.payloads()
}

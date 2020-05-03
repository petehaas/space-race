var spacex = require('./lib/spacex')

module.exports.function = function getRockets(rocketId, launch, $vivContext) {

  // Get rocketId from launch
  if (launch)
    rocketId = launch.rocket.id

  // Remove space from rocketId
  if (rocketId)
    rocketId = rocketId.replace(/\s/g, '').toLowerCase()

  return spacex.rockets(rocketId)
}

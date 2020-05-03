var spacex = require('./lib/spacex.js')

module.exports.function = function getLaunchSites ($vivContext) {
  return spacex.launchSites()
}

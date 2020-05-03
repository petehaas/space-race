var spacex = require('./lib/spacex')
var console = require('console')
var dates = require('dates')

module.exports.function = function getLaunches(launchId, rocketId, launchDate, upcoming, previous, $vivContext) {

  // Remove space from rocketId
  if (rocketId)
    rocketId = rocketId.replace(/\s/g, '').toLowerCase()

  return spacex.launches(launchId, rocketId, upcoming, previous, calculateLaunchDate(launchDate))
}

function calculateLaunchDate(date) {

  if (!date)
    return

  var start;
  var end;

  // Interval
  if (date.dateInterval) {
    if (date.dateInterval.start) {
      var s = date.dateInterval.start;
      start = dates.ZonedDateTime.of(s.year, s.month, s.day).format('yyyy-MM-dd')
    }
    if (date.dateInterval.end) {
      var e = date.dateInterval.end;
      end = dates.ZonedDateTime.of(e.year, e.month, e.day).format('yyyy-MM-dd')
    }
  }
  if (date.date) {
    var s = date.date;
    var start = dates.ZonedDateTime.of(s.year, s.month, s.day).format('yyyy-MM-dd')
    var end = dates.ZonedDateTime.of(s.year, s.month, s.day).plusDays(1).format('yyyy-MM-dd')
  }

  console.log('START', start)
  console.log('END', end)

  return [start, end]

}

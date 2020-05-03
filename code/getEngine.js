var console = require('console')

module.exports.function = function getEngine(rocket, id, $vivContext) {
   
  var match = rocket.filter(r => r.engine.number == id)

  return match[0].engine
}

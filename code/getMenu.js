var menu = require('./lib/menu')
module.exports.function = function getMenu(user, $vivContext) {
  user.numberOfTurns = ++user.numberOfTurns
  return {
    user: user,
    menuItems: menu
  }

}

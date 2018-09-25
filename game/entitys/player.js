const Entity = require('./entity')

class Player extends Entity {
  constructor (name, x, y) {
    super(name, 100, x, y)
    this.type = 'Player'
  }
}

module.exports = Player

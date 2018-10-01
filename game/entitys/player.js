const Entity = require('./entity')

class Player extends Entity {
  constructor (name, x, y) {
    super(name, 100, x, y)
    this.type = 'Player'
    this.moveset = [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 0, y: -1 }
    ]
  }
}

module.exports = Player

const Entity = require('./entity')
const Coordinate = require('../tiles/coordinate')

class Player extends Entity {
  constructor (name, position) {
    super(name, 100, position)
    this.type = 'Player'
    this.moveSet = [
      new Coordinate(2, 0),
      new Coordinate(1, -1),
      new Coordinate(1, 0),
      new Coordinate(1, 1),
      new Coordinate(0, -2),
      new Coordinate(0, -1),
      new Coordinate(0, 1),
      new Coordinate(0, 2),
      new Coordinate(-1, -1),
      new Coordinate(-1, 0),
      new Coordinate(-1, 1),
      new Coordinate(-2, 0)
    ]
  }
}

module.exports = Player

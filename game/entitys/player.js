const Entity = require('./entity')
const Coordinate = require('../tiles/coordinate')
const getWeaponDamage = require('../weapons/weapon')

class Player extends Entity {
  constructor (name, position) {
    super(name, 100, position)
    this.type = 'Player'
    this.weapon = 'PreserverRifle'
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

  getWeaponDamage () {
    return getWeaponDamage(this.weapon)
  }
}

module.exports = Player

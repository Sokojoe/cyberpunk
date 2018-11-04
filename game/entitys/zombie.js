const Entity = require('./entity')
const uuid = require('uuid/v4')
const Coordinate = require('../tiles/coordinate')

class Zombie extends Entity {
  constructor (name, position) {
    super(name, 50, position)
    this.type = 'Zombie'
    this.id = uuid()
    this.moveSet = [
      new Coordinate(1, -1),
      new Coordinate(1, 0),
      new Coordinate(1, 1),
      new Coordinate(0, -1),
      new Coordinate(0, 1),
      new Coordinate(-1, -1),
      new Coordinate(-1, 0),
      new Coordinate(-1, 1)
    ]
    this.moveAlgorith = 'zombie'
  }
}

module.exports = Zombie

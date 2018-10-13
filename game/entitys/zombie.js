const Entity = require('./entity')
const uuid = require('uuid/v4')

class Zombie extends Entity {
  constructor (name, x, y) {
    super(name, 50, x, y)
    this.type = 'Zombie'
    this.id = uuid()
    this.moveSet = [
      { x: 1, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: -1 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: -1, y: 1 },
      { x: -1, y: 0 },
      { x: -1, y: -1 }
    ]
    this.moveAlgorith = 'zombie'
  }
}

module.exports = Zombie

const Entity = require('./entity');

class Player extends Entity {
  constructor(name) {
    super(name, 100)
    this.type = "Player"
  }
}

module.exports = Player

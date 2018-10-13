const uuid = require('uuid/v4')

class Entity {
  constructor (name, maxHealth, x, y) {
    this.type = 'Entity'
    this.name = name
    this.maxHealth = maxHealth
    this.health = this.maxHealth
    this.x = x
    this.y = y
    this.id = uuid()
  }

  takeDamage (damage, deathCallback) {
    this.health -= damage
    if (this.health <= 0) {
      this.health = 0
      deathCallback()
    }
  }

  gainHealth (health) {
    this.health += health
    if (this.health >= this.maxHealth) {
      this.health = this.maxHealth
    }
  }

  increaseMaxHealth (gain) {
    this.maxHealth += gain
    this.gainHealth(gain)
  }
}

module.exports = Entity

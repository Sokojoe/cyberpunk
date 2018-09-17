
class Entity {
  constructor (name, maxHealth) {
    this.type = 'Entity'
    this.name = name
    this.maxHealth = maxHealth
    this.health = this.maxHealth
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

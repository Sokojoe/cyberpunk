import * as PIXI from 'pixi.js'
import playerSprite from '../resources/sprites/Player.png'
import zombieSprite from '../resources/sprites/Zombie.png'

const TILE_SIZE = 64

class Username extends PIXI.Text {
  constructor (text) {
    const style = new PIXI.TextStyle({
      align: 'center',
      fill: 'white',
      fontFamily: '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
      fontSize: 11,
      lineJoin: 'bevel',
      strokeThickness: 1,
      textBaseline: 'bottom'
    })
    super(text, style)
    this.anchor.set(0.5, 0)
  }
}

class HealthBar extends PIXI.Container {
  constructor () {
    super()
    this.outerBar = new PIXI.Graphics()
    // Create black rectangle for behind part of healthbar
    this.outerBar.beginFill(0x000000)
    this.outerBar.drawRect(7, 10, 50, 6)
    this.outerBar.endFill()
    this.addChild(this.outerBar)
  }

  renderHealth (health, maxHealth) {
    this.removeChild(this.innerBar)

    const healthPercent = health / maxHealth

    // Determine healthbar length
    let healthLength = 48 * healthPercent
    if (healthLength < 0) {
      healthLength = 0
    }

    // Determine healthbar color
    let color
    if (healthPercent >= 0.9) {
      color = 0x33fc07
    } else if (healthPercent >= 0.8) {
      color = 0x75fc07
    } else if (healthPercent >= 0.7) {
      color = 0x81fc07
    } else if (healthPercent >= 0.6) {
      color = 0xaefc07
    } else if (healthPercent >= 0.5) {
      color = 0xffd400
    } else if (healthPercent >= 0.4) {
      color = 0xfc9a07
    } else if (healthPercent >= 0.3) {
      color = 0xfc6407
    } else if (healthPercent >= 0.2) {
      color = 0xfc4807
    } else if (healthPercent >= 0.1) {
      color = 0xff0000
    } else {
      color = 0xbc0000
    }

    // Create and display healthbar
    this.innerBar = new PIXI.Graphics()
    this.innerBar.beginFill(color)
    this.innerBar.drawRect(8, 11, healthLength, 4)
    this.innerBar.endFill()
    this.addChild(this.innerBar)
  }
}

class EntitySprite extends PIXI.Container {
  constructor (entity, roomHeight) {
    super()
    this.x = TILE_SIZE * entity.position.x
    this.y = (roomHeight - 1 - entity.position.y) * TILE_SIZE

    if (entity.type === 'Player') {
      this.sprite = PIXI.Sprite.fromImage(playerSprite, false)
      this.player = entity
    } else if (entity.type === 'Zombie') {
      this.sprite = PIXI.Sprite.fromImage(zombieSprite, false)
    }
    this.height = TILE_SIZE
    this.width = TILE_SIZE

    this.name = new Username(entity.name.toUpperCase())
    this.nameContainer = new PIXI.Container()
    this.nameContainer.x = TILE_SIZE / 2
    this.nameContainer.addChild(this.name)

    this.healthBar = new HealthBar()
    this.renderHealth(entity.health, entity.maxHealth)

    this.addChild(this.sprite)
    this.addChild(this.nameContainer)
    this.addChild(this.healthBar)
  }

  renderHealth (health, maxHealth) {
    this.healthBar.renderHealth(health, maxHealth)
  }
}

module.exports = EntitySprite

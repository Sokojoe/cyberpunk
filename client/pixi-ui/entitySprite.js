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

    this.addChild(this.sprite)
    this.addChild(this.nameContainer)
  }
}

module.exports = EntitySprite

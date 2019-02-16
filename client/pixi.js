import * as PIXI from 'pixi.js'
import playerSprite from './resources/sprites/Player.png'
import zombieSprite from './resources/sprites/Zombie.png'
import tile from './resources/sprites/floor.png'
import AttackPatternSquare from './ui/attackPatternSquare.js'
import Coordinate from '../game/tiles/coordinate.js'

const TILE_SIZE = 64

class View {
  constructor () {
    this.app = new PIXI.Application({ width: 640, height: 704, transparent: true })
    this.entitySprites = {}
  }

  renderRoom (room) {
    this.room = room

    let container = new PIXI.Container()

    // Create map
    for (let x = 0; x < room.width; x++) {
      for (let y = 0; y < room.height; y++) {
        let floorTile = PIXI.Sprite.fromImage(tile)
        floorTile.height = TILE_SIZE
        floorTile.width = TILE_SIZE
        floorTile.x = x * TILE_SIZE
        floorTile.y = y * TILE_SIZE
        container.addChild(floorTile)
      }
    }

    // Remove the old map
    this.app.stage.removeChild(this.mapContainer)

    // Render map
    this.app.stage.addChild(container)
    this.mapContainer = container
  }

  renderEntity (entity) {
    this.app.stage.removeChild(this.entitySprites[entity.id])

    let sprite
    if (entity.type === 'Player') {
      sprite = PIXI.Sprite.fromImage(playerSprite, false)
      this.player = entity
    } else if (entity.type === 'Zombie') {
      sprite = PIXI.Sprite.fromImage(zombieSprite, false)
    }

    sprite.height = TILE_SIZE
    sprite.width = TILE_SIZE
    sprite.x = TILE_SIZE * entity.position.x
    sprite.y = (this.room.height - 1 - entity.position.y) * TILE_SIZE
    this.app.stage.addChild(sprite)

    this.entitySprites[entity.id] = sprite
  }

  renderEntityTurn (entity) {
    const sprite = this.entitySprites[entity.id]
    // console.log(`${entity.name} moved to (${entity.position.x}, ${entity.position.y}).`)
    return this.tweenSprite(sprite, entity.position, 400)
  }

  renderEntityAction (action) {
    const sprite = this.entitySprites[action.attacker.id]
    // console.log(`${action.attacker.name} attacked (${action.attack.x}, ${action.attack.y}).`)
    action.targets.forEach((attack) => {
      console.log(`Attack hit ${attack.target.name} for ${attack.damage}. ${attack.target.name} now has ${attack.target.health}/${attack.target.maxHealth} left!`)
    })

    return new Promise((resolve, reject) => {
      const attackIndicator = action.attack.attackPattern.map((square) => {
        const targetSquare = Coordinate.addCoodinates(square, { x: action.attack.x, y: action.attack.y })
        return new AttackPatternSquare(this.app.stage, targetSquare, action.attacker.position)
      })
      this.bounceSprite(sprite).then(() => {
        attackIndicator.forEach(attackSquare => attackSquare.remove())
        resolve()
      })
    })
  }

  tweenSprite (sprite, coordinates, time) {
    const destinationX = (TILE_SIZE * coordinates.x) - sprite.x
    const destinationY = sprite.y - (this.room.height - 1 - coordinates.y) * TILE_SIZE
    const position = { x: destinationX, y: destinationY }
    return this.moveSprite(sprite, position, time)
  }

  moveSprite (sprite, position, time) {
    const ticker = this.app.ticker
    let currentTime = 0
    const originalX = sprite.x
    const originalY = sprite.y
    const destinationX = sprite.x + position.x
    const destinationY = sprite.y - position.y
    return new Promise((resolve, reject) => {
      function tween () {
        currentTime = currentTime + ticker.elapsedMS
        if (currentTime > time) {
          sprite.x = destinationX
          sprite.y = destinationY
          resolve()
          ticker.remove(tween)
        } else {
          sprite.x = originalX + ((destinationX - originalX) * (currentTime / time))
          sprite.y = originalY + ((destinationY - originalY) * (currentTime / time))
        }
      }
      ticker.add(tween)
    })
  }

  bounceSprite (sprite) {
    return new Promise((resolve, reject) => {
      this.moveSprite(sprite, { x: 0, y: 30 }, 150).then(
        () => {
          this.moveSprite(sprite, { x: 0, y: -30 }, 150).then(() => resolve())
        }
      )
    })
  }
}

module.exports = View

import * as PIXI from 'pixi.js'
import playerSprite from './resources/sprites/Player.png'
import zombieSprite from './resources/sprites/Zombie.png'
import tile from './resources/sprites/floor.png'

const TILE_SIZE = 64

class View {
  constructor () {
    this.app = new PIXI.Application({ width: 1400, height: 900 })

    const canvasLocation = document.getElementById('pixiCanvas')
    canvasLocation.appendChild(this.app.view)

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

  renderEntitiesTurn (entities) {
    for (const key in entities) {
      const entity = entities[key]
      this.renderEntityTurn(entity)
      console.log(entity.name + ' moved to (' + entity.position.x + ', ' + entity.position.y + ')')
      if (entity.type === 'Player') {
        this.player = entity
      }
    }
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
    return this.tweenSprite(sprite, entity.position, 600)
  }

  tweenSprite (sprite, coordinates, time) {
    const ticker = this.app.ticker
    let currentTime = 0
    const originalX = sprite.x
    const originalY = sprite.y
    const destinationX = TILE_SIZE * coordinates.x
    const destinationY = (this.room.height - 1 - coordinates.y) * TILE_SIZE
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
}
module.exports = View

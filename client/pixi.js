import * as PIXI from 'pixi.js'
import playerSprite from './resources/sprites/Player.png'
import tile from './resources/sprites/floor.png'

const TILE_SIZE = 64

class View {
  constructor () {
    this.app = new PIXI.Application({width: 1400, height: 900})

    const canvasLocation = document.getElementById('pixiCanvas')
    canvasLocation.appendChild(this.app.view)
  }

  renderMap (width, height, baseTile, moveFunction) {
    this.mapWidth = width
    this.mapHeight = height

    let container = new PIXI.Container()

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let floorTile = PIXI.Sprite.fromImage(tile)
        floorTile.height = TILE_SIZE
        floorTile.width = TILE_SIZE
        floorTile.x = x * TILE_SIZE
        floorTile.y = y * TILE_SIZE
        floorTile.coordinates = { 'x': x, 'y': (height - 1) - y }
        floorTile.interactive = true
        floorTile.buttonMode = true
        floorTile.on('pointerdown', () => { moveFunction(floorTile.coordinates) })
        container.addChild(floorTile)
      }
    }
    // Remove the old map
    this.app.stage.removeChild(this.mapContainer)
    this.app.stage.addChild(container)
    this.mapContainer = container
  }

  createPlayer () {
    this.app.stage.removeChild(this.player)
    this.player = PIXI.Sprite.fromImage(playerSprite, false)
    this.player.height = TILE_SIZE
    this.player.width = TILE_SIZE
    this.app.stage.addChild(this.player)
  }

  setPlayerLocation (coordinates) {
    this.player.x = coordinates.x * TILE_SIZE
    this.player.y = (this.mapHeight - coordinates.y - 1) * TILE_SIZE
  }
}

module.exports = View

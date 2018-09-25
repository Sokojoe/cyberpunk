import * as PIXI from 'pixi.js'
import playerSprite from './resources/sprites/Player.png'
import tile from './resources/sprites/floor.png'

class View {
  constructor () {
    this.app = new PIXI.Application()

    const canvasLocation = document.getElementById('pixiCanvas')
    canvasLocation.appendChild(this.app.view)
  }

  renderMap (width, height, baseTile) {
    this.mapWidth = width
    this.mapHeight = height

    let container = new PIXI.Container()

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let floorTile = PIXI.Sprite.fromImage(tile)
        floorTile.x = x * 32
        floorTile.y = y * 32
        floorTile.coordinates = { 'x': x, 'y': (height - 1) - y }
        floorTile.interactive = true
        floorTile.buttonMode = true
        floorTile.on('pointerdown', () => { this.onTileClick(floorTile) })
        container.addChild(floorTile)
      }
    }
    // Remove the old map
    this.app.stage.removeChild(this.mapContainer)
    this.app.stage.addChild(container)
    this.mapContainer = container
  }

  createPlayer (x, y) {
    this.app.stage.removeChild(this.player)
    this.player = PIXI.Sprite.fromImage(playerSprite)
    this.app.stage.addChild(this.player)
    this.setPlayerLocation({ x: x, y: y })
  }

  setPlayerLocation (coordinates) {
    this.player.x = coordinates.x * 32
    this.player.y = (this.mapHeight - coordinates.y - 1) * 32
  }

  onTileClick (tile) {
    console.log(tile.coordinates)
    this.setPlayerLocation(tile.coordinates)
  }
}

module.exports = View

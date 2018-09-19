import * as PIXI from 'pixi.js'
import tile from './resources/sprites/floor.png'
import playerSprite from './resources/sprites/Player.png'

class View {
  constructor () {
    this.app = new PIXI.Application()

    const canvasLocation = document.getElementById('pixiCanvas')
    canvasLocation.appendChild(this.app.view)

    this.renderMap()
    this.createPlayer()
  }

  renderMap () {
    let container = new PIXI.Container()

    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 15; y++) {
        let floorTile = PIXI.Sprite.fromImage(tile)
        floorTile.x = x * 32
        floorTile.y = y * 32
        floorTile.coordinates = { 'x': x, 'y': y }
        floorTile.interactive = true
        floorTile.buttonMode = true
        floorTile.on('pointerdown', () => { this.onTileClick(floorTile) })
        container.addChild(floorTile)
      }
    }

    this.app.stage.addChild(container)
  }

  createPlayer () {
    this.player = PIXI.Sprite.fromImage(playerSprite)
    this.app.stage.addChild(this.player)
  }

  setPlayerLocation (coordinates) {
    this.player.x = coordinates.x * 32
    this.player.y = coordinates.y * 32
  }

  onTileClick (tile) {
    console.log(tile.coordinates)
    this.setPlayerLocation(tile.coordinates)
  }
}

module.exports = { View }

import * as PIXI from 'pixi.js'
import playerSprite from './resources/sprites/Player.png'
import tile from './resources/sprites/floor.png'

const TILE_SIZE = 64

class View {
  constructor () {
    this.app = new PIXI.Application({ width: 1400, height: 900 })

    const canvasLocation = document.getElementById('pixiCanvas')
    canvasLocation.appendChild(this.app.view)
  }

  renderMap (width, height, baseTile, moveFunction) {
    this.mapWidth = width
    this.mapHeight = height
    this.moveFunction = moveFunction

    let container = new PIXI.Container()

    // Create map
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
        floorTile.on('pointerdown', () => {
          this.playerMove = floorTile.coordinates
          this.renderEndTurnButton(TILE_SIZE * 4, TILE_SIZE * 10)
        })
        container.addChild(floorTile)
      }
    }

    // Remove the old map
    this.app.stage.removeChild(this.mapContainer)

    // Render map
    this.app.stage.addChild(container)
    this.mapContainer = container

    // Render end turn button
    this.renderEndTurnButton(TILE_SIZE * 4, TILE_SIZE * 10)
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

  renderEndTurnButton (x, y) {
    // Remove old button
    this.app.stage.removeChild(this.endTurnButton)

    const btnHeight = TILE_SIZE
    const btnWidth = TILE_SIZE * 2

    // Create new button
    let container = new PIXI.Container()
    container.x = x
    container.y = y
    let background = new PIXI.Graphics()
    let text = new PIXI.Text()
    text.y = btnHeight / 4
    text.x = btnWidth / 8
    text.style.align = 'center'
    text.style.fontFamily = 'Arial'
    text.style.fontSize = 22

    if (this.playerMove) {
      text.text = 'End Turn'
      background.beginFill(0xFFFF00)
      container.interactive = true
      container.buttonMode = true
      container.on('pointerdown', () => {
        this.moveFunction(this.playerMove)
        this.playerMove = null
        this.renderEndTurnButton(x, y)
      })
    } else {
      text.text = 'Move'
      background.beginFill(0x00FF00)
    }
    background.drawRect(0, 0, btnWidth, btnHeight)

    // Render button
    container.addChild(background)
    container.addChild(text)
    this.endTurnButton = container
    this.app.stage.addChild(container)
  }
}

module.exports = View

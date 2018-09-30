import * as PIXI from 'pixi.js'
import playerSprite from './resources/sprites/Player.png'
import tile from './resources/sprites/floor.png'

const TILE_SIZE = 64

const END_TURN_BUTTON_COORDS = { x: 4, y: 10 }

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
        container.addChild(floorTile)
      }
    }

    // Remove the old map
    this.app.stage.removeChild(this.mapContainer)

    // Render map
    this.app.stage.addChild(container)
    this.mapContainer = container
  }

  renderValidMoveSquares (coordinateMap) {
    let container = new PIXI.Container()
    container.x = this.player.x
    container.y = this.player.y

    for (const coord in coordinateMap) {
      let moveSquare = new PIXI.Graphics()
      moveSquare.beginFill(0x00FF00)
      moveSquare.fillAlpha = 0.15
      moveSquare.drawRect(coordinateMap[coord].x * TILE_SIZE, -coordinateMap[coord].y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      moveSquare.interactive = true
      moveSquare.buttonMode = true
      moveSquare.on('pointerdown', () => {
        this.playerMove = { x: this.playerCoords.x + coordinateMap[coord].x, y: this.playerCoords.y + coordinateMap[coord].y }
        this.renderEndTurnButton()
      })
      container.addChild(moveSquare)
    }
    this.app.stage.removeChild(this.validMoveSquares)
    this.validMoveSquares = container
    this.app.stage.addChild(this.validMoveSquares)
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

    this.playerCoords = { x: coordinates.x, y: coordinates.y }
    // Render end turn button
    this.renderEndTurnButton()
  }

  renderEndTurnButton () {
    // Remove old button
    this.app.stage.removeChild(this.endTurnButton)

    const btnHeight = TILE_SIZE
    const btnWidth = TILE_SIZE * 2

    // Create new button
    let container = new PIXI.Container()
    container.x = END_TURN_BUTTON_COORDS.x * TILE_SIZE
    container.y = END_TURN_BUTTON_COORDS.y * TILE_SIZE
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
      this.app.stage.removeChild(this.validMoveSquares)
      container.on('pointerdown', () => {
        this.moveFunction(this.playerMove)
        this.playerMove = null
        this.renderEndTurnButton()
      })
    } else {
      text.text = 'Move'
      background.beginFill(0x00FF00)
      this.renderValidMoveSquares({
        1: { x: 1, y: 0 },
        2: { x: 0, y: 1 },
        3: { x: -1, y: 0 },
        4: { x: 0, y: -1 }
      })
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

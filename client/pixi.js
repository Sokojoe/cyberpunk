import * as PIXI from 'pixi.js'
import playerSprite from './resources/sprites/Player.png'
import tile from './resources/sprites/floor.png'

const TILE_SIZE = 64

const MOVE_BUTTON_COORDS = { x: 0, y: 10 }
const END_TURN_BUTTON_COORDS = { x: 2, y: 10 }

class View {
  constructor () {
    this.app = new PIXI.Application({ width: 1400, height: 900 })

    const canvasLocation = document.getElementById('pixiCanvas')
    canvasLocation.appendChild(this.app.view)
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

  renderEntities (entities, username) {
    this.username = username
    this.entities = entities

    this.renderEntity(entities[username])
  }

  renderEntity (entity) {
    this.app.stage.removeChild(this.player)
    const sprite = PIXI.Sprite.fromImage(playerSprite, false)
    sprite.height = TILE_SIZE
    sprite.width = TILE_SIZE
    sprite.x = TILE_SIZE * entity.x
    sprite.y = (this.room.height - 1 - entity.y) * TILE_SIZE
    this.player = sprite
    this.app.stage.addChild(sprite)
  }

  renderMoveButton (uiManager) {
    const btnHeight = TILE_SIZE
    const btnWidth = TILE_SIZE * 2

    let container = new PIXI.Container()
    container.x = MOVE_BUTTON_COORDS.x * TILE_SIZE
    container.y = MOVE_BUTTON_COORDS.y * TILE_SIZE

    let background = new PIXI.Graphics()
    let text = new PIXI.Text()
    text.y = btnHeight / 4
    text.x = btnWidth / 8
    text.style.align = 'center'
    text.style.fontFamily = 'Arial'
    text.style.fontSize = 22
    text.text = 'Move'

    // Render button
    container.addChild(background)
    container.addChild(text)
    const moveButton = {}
    moveButton.container = container
    moveButton.setActive = (playerMoveSet) => {
      uiManager.endTurnButton.setUnActive()
      container.interactive = false
      container.buttonMode = false
      this.renderMoveOptions(moveButton, playerMoveSet)
      this.app.stage.removeChild(container)
      background.beginFill(0x00FF00)
      background.drawRect(0, 0, btnWidth, btnHeight)

      this.app.stage.addChild(container)
    }
    moveButton.setUnActive = (playerMoveSet) => {
      this.app.stage.removeChild(container)
      this.app.stage.removeChild(moveButton.moveOptions)
      background.beginFill(0x0000FF)
      background.drawRect(0, 0, btnWidth, btnHeight)
      this.app.stage.addChild(container)
      container.interactive = true
      container.buttonMode = true
      container.on('pointerdown', () => {
        moveButton.setActive(playerMoveSet)
      })
      uiManager.endTurnButton.setActive()
    }
    return moveButton
  }

  renderMoveOptions (moveButton, coordinateMap) {
    const player = this.entities[this.username]
    let container = new PIXI.Container()
    container.x = player.x * TILE_SIZE
    container.y = (this.room.height - 1 - player.y) * TILE_SIZE

    for (const coord in coordinateMap) {
      let moveSquare = new PIXI.Graphics()
      moveSquare.beginFill(0x00FF00)
      moveSquare.fillAlpha = 0.15
      moveSquare.drawRect(coordinateMap[coord].x * TILE_SIZE, -coordinateMap[coord].y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      moveSquare.interactive = true
      moveSquare.buttonMode = true
      moveSquare.on('pointerdown', () => {
        moveButton.playerMove = { x: player.x + coordinateMap[coord].x, y: player.y + coordinateMap[coord].y }
        moveButton.setUnActive(coordinateMap)
      })
      container.addChild(moveSquare)
    }

    this.app.stage.removeChild(moveButton.moveOptions)
    moveButton.moveOptions = container
    this.app.stage.addChild(container)
  }

  renderEndTurnButton (uiManager, submitTurn) {
    const btnHeight = TILE_SIZE
    const btnWidth = TILE_SIZE * 2

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
    text.text = 'EndTurn'

    // Render button
    container.addChild(background)
    container.addChild(text)
    const endTurnButton = {}
    endTurnButton.container = container
    endTurnButton.setActive = () => {
      this.app.stage.removeChild(container)
      background.beginFill(0x00FF00)
      background.drawRect(0, 0, btnWidth, btnHeight)
      container.interactive = true
      container.buttonMode = true
      container.on('pointerdown', () => {
        submitTurn()
        endTurnButton.setUnActive()
      })
      this.app.stage.addChild(container)
    }
    endTurnButton.setUnActive = () => {
      container.interactive = false
      container.buttonMode = false
      this.app.stage.removeChild(container)
      background.beginFill(0x0000FF)
      background.drawRect(0, 0, btnWidth, btnHeight)
      this.app.stage.addChild(container)
    }
    return endTurnButton
  }
}

module.exports = View

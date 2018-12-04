import * as PIXI from 'pixi.js'
import playerSprite from './resources/sprites/Player.png'
import zombieSprite from './resources/sprites/Zombie.png'
import tile from './resources/sprites/floor.png'
import Coordinate from '../game/tiles/coordinate'

const TILE_SIZE = 64

const MOVE_BUTTON_COORDS = new Coordinate(0, 10)
const ATTACK_BUTTON_COORDS = new Coordinate(2, 10)
const END_TURN_BUTTON_COORDS = new Coordinate(4, 10)

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

  renderEntities (entities) {
    for (const key in entities) {
      const entity = entities[key]
      const sprite = this.renderEntity(entity)
      this.entitySprites[entity.id] = sprite
    }
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

    return sprite
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

    // Define button clicked
    container.on('pointerdown', () => {
      moveButton.setActive()
    })

    moveButton.setActive = (playerMoveSet) => {
      // Cache the players moveset incase function is called without moveSet
      if (playerMoveSet) {
        this.playerMoveSet = playerMoveSet
      }
      uiManager.endTurnButton.setUnActive()
      container.interactive = false
      container.buttonMode = false
      this.renderMoveOptions(moveButton, this.playerMoveSet)
      this.app.stage.removeChild(container)
      background.beginFill(0x00FF00)
      background.drawRect(0, 0, btnWidth, btnHeight)

      this.app.stage.addChild(container)
    }

    moveButton.setUnActive = () => {
      this.app.stage.removeChild(container)
      this.app.stage.removeChild(moveButton.moveOptions)
      background.beginFill(0x0000FF)
      background.drawRect(0, 0, btnWidth, btnHeight)
      this.app.stage.addChild(container)
      container.interactive = true
      container.buttonMode = true
      uiManager.endTurnButton.setActive()
    }
    return moveButton
  }

  renderMoveOptions (moveButton, coordinateMap) {
    const player = this.player
    let container = new PIXI.Container()
    container.x = player.position.x * TILE_SIZE
    container.y = (this.room.height - 1 - player.position.y) * TILE_SIZE

    for (const coord in coordinateMap) {
      let moveSquare = new PIXI.Graphics()
      moveSquare.beginFill(0x00FF00)
      moveSquare.fillAlpha = 0.15
      moveSquare.drawRect(coordinateMap[coord].x * TILE_SIZE, -coordinateMap[coord].y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      moveSquare.interactive = true
      moveSquare.buttonMode = true
      moveSquare.on('pointerdown', () => {
        moveButton.playerMove = new Coordinate(player.position.x + coordinateMap[coord].x, player.position.y + coordinateMap[coord].y)
        moveButton.setUnActive(coordinateMap)
      })
      container.addChild(moveSquare)
    }

    this.app.stage.removeChild(moveButton.moveOptions)
    moveButton.moveOptions = container
    this.app.stage.addChild(container)
  }

  renderAttackButton (uiManager) {
    const btnHeight = TILE_SIZE
    const btnWidth = TILE_SIZE * 2

    let container = new PIXI.Container()
    container.x = ATTACK_BUTTON_COORDS.x * TILE_SIZE
    container.y = ATTACK_BUTTON_COORDS.y * TILE_SIZE

    let background = new PIXI.Graphics()
    let text = new PIXI.Text()
    text.y = btnHeight / 4
    text.x = btnWidth / 8
    text.style.align = 'center'
    text.style.fontFamily = 'Arial'
    text.style.fontSize = 22
    text.text = 'Attack'

    // Render button
    container.addChild(background)
    container.addChild(text)
    const attackButton = {}
    attackButton.container = container

    // Define button clicked
    container.on('pointerdown', () => {
      attackButton.setActive()
    })

    attackButton.setActive = (playerMoveSet) => {
      // Cache the players moveset incase function is called without moveSet
      if (playerMoveSet) {
        this.playerMoveSet = playerMoveSet
      }
      uiManager.endTurnButton.setUnActive()
      container.interactive = false
      container.buttonMode = false
      this.renderAttackOptions(attackButton, this.playerMoveSet)
      this.app.stage.removeChild(container)
      background.beginFill(0x00FF00)
      background.drawRect(0, 0, btnWidth, btnHeight)

      this.app.stage.addChild(container)
    }

    attackButton.setUnActive = () => {
      this.app.stage.removeChild(container)
      this.app.stage.removeChild(attackButton.attackOptions)
      background.beginFill(0x0000FF)
      background.drawRect(0, 0, btnWidth, btnHeight)
      this.app.stage.addChild(container)
      container.interactive = true
      container.buttonMode = true
      uiManager.endTurnButton.setActive()
    }
    return attackButton
  }

  renderAttackOptions (attackButton, coordinateMap) {
    const player = this.player
    let container = new PIXI.Container()
    container.x = player.position.x * TILE_SIZE
    container.y = (this.room.height - 1 - player.position.y) * TILE_SIZE

    for (const coord in coordinateMap) {
      let attackSquare = new PIXI.Graphics()
      attackSquare.beginFill(0xFF0000)
      attackSquare.fillAlpha = 0.15
      attackSquare.drawRect(coordinateMap[coord].x * TILE_SIZE, -coordinateMap[coord].y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      attackSquare.interactive = true
      attackSquare.buttonMode = true
      attackSquare.on('pointerdown', () => {
        console.log('clicked ' + coordinateMap[coord])
        attackButton.setUnActive()
      })
      container.addChild(attackSquare)
    }

    this.app.stage.removeChild(attackButton.attackOptions)
    attackButton.attackOptions = container
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

    // Assemble button
    container.addChild(background)
    container.addChild(text)
    const endTurnButton = {}
    endTurnButton.container = container

    // Add handler for when button is clicked
    container.on('pointerdown', () => {
      submitTurn()
      endTurnButton.setUnActive()
    })

    endTurnButton.setActive = () => {
      this.app.stage.removeChild(container)
      background.beginFill(0x00FF00)
      background.drawRect(0, 0, btnWidth, btnHeight)
      container.interactive = true
      container.buttonMode = true
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

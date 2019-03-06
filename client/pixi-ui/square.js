'use strict'

import * as PIXI from 'pixi.js'

const TILE_SIZE = 64
const ROOM_HEIGHT = 10

class Square {
  constructor (stage, options, position, playerPosition) {
    const x = (playerPosition.x + position.x) * TILE_SIZE
    const y = (-position.y + ROOM_HEIGHT - 1 - playerPosition.y) * TILE_SIZE

    this.stage = stage
    this.position = position
    this.square = new PIXI.Graphics()
    this.square.beginFill(options.color)
    if (options.fillAlpha) {
      this.square.fillAlpha = options.fillAlpha
    } else {
      this.square.fillAlpha = 0.15
    }
    if (options.lineStyle) {
      this.square.lineStyle(options.lineStyle[0], options.lineStyle[1], options.lineStyle[2])
    }
    this.square.drawRect(x, y, TILE_SIZE, TILE_SIZE)
    this.square.endFill()
    this.square.on('pointerdown', () => {
      if (this.clickEvent) {
        this.clickEvent()
      }
    })
    this.square.on('mouseover', () => {
      if (this.enterHover) {
        this.enterHover()
      }
    })
    this.square.on('mouseout', () => {
      if (this.exitHover) {
        this.exitHover()
      }
    })
    stage.addChild(this.square)
  }

  onClick (func) {
    this.square.interactive = true
    this.square.buttonMode = true
    this.clickEvent = func
  }

  onHoverEnter (func) {
    this.square.interactive = true
    this.square.buttonMode = true
    this.enterHover = func
  }

  onHoverExit (func) {
    this.exitHover = func
  }

  remove () {
    this.stage.removeChild(this.square)
  }
}

module.exports = Square

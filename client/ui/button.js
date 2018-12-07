'use strict'

import * as PIXI from 'pixi.js'

const TILE_SIZE = 64
const activeColor = 0x00FF00
const inactiveColor = 0x0000FF

class Button {
  constructor (stage, text, position) {
    this.stage = stage
    this.position = position

    this.btnHeight = TILE_SIZE
    this.btnWidth = TILE_SIZE * 2

    const button = new PIXI.Container()
    button.x = position.x * TILE_SIZE
    button.y = position.y * TILE_SIZE

    const background = new PIXI.Graphics()
    const buttonText = new PIXI.Text()
    buttonText.y = this.btnHeight / 4
    buttonText.x = this.btnWidth / 8
    buttonText.style.align = 'center'
    buttonText.style.fontFamily = 'Arial'
    buttonText.style.fontSize = 22
    buttonText.text = text

    button.addChild(background)
    button.addChild(buttonText)

    this.button = button
    this.text = buttonText
    this.background = background

    this.button.on('pointerdown', () => {
      if (this.clickEvent) {
        this.clickEvent()
      }
    })
  }

  onClick (func) {
    this.clickEvent = func
  }

  setActive (func) {
    this.stage.removeChild(this.button)
    this.background.beginFill(activeColor)
    this.background.drawRect(0, 0, this.btnWidth, this.btnHeight)
    this.button.interactive = false
    this.button.buttonMode = false
    this.stage.addChild(this.button)
    func()
  }

  setUnActive (func) {
    this.stage.removeChild(this.button)
    this.background.beginFill(inactiveColor)
    this.background.drawRect(0, 0, this.btnWidth, this.btnHeight)
    this.button.interactive = true
    this.button.buttonMode = true
    this.stage.addChild(this.button)
    func()
  }
}

module.exports = Button

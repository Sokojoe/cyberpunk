'use strict'

import Button from './button'
import MoveSquare from './moveSquare'

class MoveButton extends Button {
  constructor (stage, uiManager, playerState, turnSet) {
    super(stage, 'Move', { x: 0, y: 10 })
    this.onClick(() => {
      uiManager.setThisActive(this)
    })
    console.log(playerState)
    this.moveSet = playerState.moveSet
    this.playerPosition = playerState.position
    this.moveSquares = []
    this.turnSet = turnSet
    this.uiManager = uiManager
  }

  setActive () {
    super.setActive(() => {
      for (const key in this.moveSet) {
        const move = this.moveSet[key]
        this.moveSquares.push(new MoveSquare(
          this.stage,
          move,
          this.playerPosition,
          this.turnSet,
          () => {
            this.uiManager.setNextActive()
          }
        )
        )
      }
    })
  }

  setUnActive () {
    super.setUnActive(() => {
      while (this.moveSquares.length > 0) {
        const square = this.moveSquares.pop()
        square.remove()
      }
    })
  }
}

module.exports = MoveButton

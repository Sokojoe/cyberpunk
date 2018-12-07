'use strict'

import Button from './button'
import MoveSquare from './moveSquare'

class MoveButton extends Button {
  constructor (stage, uiManager, playerState, turnSet) {
    super(stage, 'Move', { x: 0, y: 10 })
    this.onClick(() => {
      uiManager.setThisActive(this)
    })
    this.playerState = playerState
    this.moveSquares = []
    this.turnSet = turnSet
    this.uiManager = uiManager
  }

  setActive () {
    super.setActive(() => {
      for (const key in this.playerState.moveSet) {
        const move = this.playerState.moveSet[key]
        this.moveSquares.push(new MoveSquare(
          this.stage,
          move,
          this.playerState.position,
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

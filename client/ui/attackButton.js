'use strict'

import Button from './button'
import AttackSquare from './attackSquare'

class AttackButton extends Button {
  constructor (stage, uiManager, playerState, turnSet) {
    super(stage, 'Attack', { x: 2, y: 10 })
    this.onClick(() => {
      uiManager.setThisActive(this)
    })
    this.attackSet = playerState.attackSet
    this.playerPosition = playerState.position
    this.attackSquares = []
    this.stage = stage
    this.turnSet = turnSet
    this.uiManager = uiManager
  }

  setActive () {
    super.setActive(() => {
      for (const key in this.attackSet) {
        const attack = this.attackSet[key]
        this.attackSquares.push(new AttackSquare(
          this.stage,
          attack,
          this.playerPosition,
          this.turnSet,
          () => {
            this.uiManager.setNextActive()
          })
        )
      }
    })
  }

  setUnActive () {
    super.setUnActive(() => {
      while (this.attackSquares.length > 0) {
        const square = this.attackSquares.pop()
        square.remove()
      }
    })
  }
}

module.exports = AttackButton

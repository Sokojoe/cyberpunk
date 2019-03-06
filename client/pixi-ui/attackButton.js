'use strict'

import Button from './button'
import AttackSquare from './attackSquare'
import attackValidator from '../../game/validators/attackValidator'

class AttackButton extends Button {
  constructor (stage, uiManager, playerState, turnSet) {
    super(stage, 'Attack', { x: 2, y: 10 })
    this.onClick(() => {
      uiManager.setThisActive(this)
    })
    this.playerState = playerState
    this.attackSquares = []
    this.stage = stage
    this.turnSet = turnSet
    this.uiManager = uiManager
  }

  setActive () {
    this.setUnActive()
    const attackSet = attackValidator.calculateValidAttackSet({
      position: this.playerState.nextPos,
      weapon: this.playerState.player.weapon },
    this.playerState.map)
    super.setActive(() => {
      for (const key in attackSet) {
        const attack = attackSet[key]
        this.attackSquares.push(new AttackSquare(
          this.stage,
          attack,
          this.playerState.nextPos,
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

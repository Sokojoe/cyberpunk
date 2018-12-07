'use strict'

import Square from './square'
import AttackPatternSquare from './AttackPatternSquare'

class AttackSquare extends Square {
  constructor (stage, attack, playerPosition, turnSet, close) {
    super(stage, { color: 0xFF0000 }, attack, playerPosition)
    this.playerPosition = playerPosition
    this.onClick(() => {
      turnSet.attack = attack
      console.log(turnSet)
      close()
    })
    this.onHoverEnter(() => {
      this.renderAttackPattern(attack)
    })
    this.onHoverExit(() => {
      this.removeAttackPattern()
    })
    this.attackPattern = []
    this.stage = stage
  }

  renderAttackPattern (attack) {
    for (const key in attack.attackPattern) {
      const base = {
        x: attack.x + this.playerPosition.x,
        y: attack.y + this.playerPosition.y
      }
      this.attackPattern.push(new AttackPatternSquare(
        this.stage,
        attack.attackPattern[key],
        base)
      )
    }
  }

  removeAttackPattern () {
    while (this.attackPattern.length > 0) {
      const square = this.attackPattern.pop()
      square.remove()
    }
  }

  remove () {
    this.removeAttackPattern()
    super.remove()
  }
}

module.exports = AttackSquare

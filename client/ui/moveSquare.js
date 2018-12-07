'use strict'

import Square from './square'

class MoveSquare extends Square {
  constructor (stage, position, playerPosition, turnSet, close) {
    super(stage, { color: 0x00FF00 }, position, playerPosition)
    this.turnSet = turnSet
    this.onClick(() => {
      turnSet.move = this.position
      close()
    })
  }
}

module.exports = MoveSquare

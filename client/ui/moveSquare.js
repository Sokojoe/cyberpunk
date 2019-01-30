'use strict'

import Square from './square'
import Coordinate from '../../game/tiles/coordinate'

class MoveSquare extends Square {
  constructor (stage, position, playerState, turnSet, close) {
    super(stage, { color: 0x00FF00 }, position, playerState.player.position)
    this.turnSet = turnSet
    this.onClick(() => {
      turnSet.move = position
      playerState.nextPos = Coordinate.addCoodinates(position, playerState.player.position)
      close()
    })
  }
}

module.exports = MoveSquare

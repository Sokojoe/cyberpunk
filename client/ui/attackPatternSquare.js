'use strict'

import Square from './square'

class AttackPatternSquare extends Square {
  constructor (stage, attack, playerPosition) {
    const options = { color: 0xFF0000, lineStyle: [3, 0xFF0000, 1] }
    super(stage, options, attack, playerPosition)
  }
}

module.exports = AttackPatternSquare

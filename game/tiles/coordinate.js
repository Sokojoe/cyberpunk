'use strict'

class Coordinate {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  static isSame (coordinate1, coordinate2) {
    const sameX = (coordinate1.x === coordinate2.x)
    const sameY = (coordinate1.y === coordinate2.y)
    if (sameX && sameY) {
      return true
    } else {
      return false
    }
  }

  static addCoodinates (coordinate1, coordinate2) {
    return new Coordinate(coordinate1.x + coordinate2.x, coordinate1.y + coordinate2.y)
  }

  apply (coordinate) {
    return new Coordinate(this.x + coordinate.x, this.y + coordinate.y)
  }
}

module.exports = Coordinate

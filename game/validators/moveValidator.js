'use strict'

function calculateMoveSet (entity, map) {
  let validMoveSet = []
  const moveSet = entity.moveSet
  for (const key in moveSet) {
    const move = moveSet[key]
    const moveX = move.x + entity.x
    const moveY = move.y + entity.y
    if (moveX >= 0 && moveX < map.width) {
      if (moveY >= 0 && moveY < map.height) {
        validMoveSet.push({ 'x': move.x, 'y': move.y })
      }
    }
  }
  return validMoveSet
}

module.exports = calculateMoveSet

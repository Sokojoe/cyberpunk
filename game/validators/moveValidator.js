'use strict'

function calculateMoveSet (entity, map) {
  let validMoveSet = []
  const moveSet = entity.moveSet
  for (const key in moveSet) {
    if (isMoveValid(entity, map, moveSet[key])) {
      validMoveSet.push(moveSet[key])
    }
  }
  return validMoveSet
}

function isMoveValid (entity, map, move) {
  let moveValid = true

  const moveX = move.x + entity.x
  const moveY = move.y + entity.y

  // Check if move is outside map bounds
  if (moveX < 0 || moveX >= map.width) {
    moveValid = false
  } else if (moveY < 0 || moveY >= map.height) {
    moveValid = false
  }

  return moveValid
}

module.exports = calculateMoveSet

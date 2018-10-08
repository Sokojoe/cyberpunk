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
  const moveX = move.x + entity.x
  const moveY = move.y + entity.y

  // Check if move is outside map bounds
  if (moveX < 0 || moveX >= map.width) {
    return false
  } else if (moveY < 0 || moveY >= map.height) {
    return false
  }

  // Check if move exists in move set
  for (const key in entity.moveSet) {
    const setMove = entity.moveSet[key]
    if (move.x === setMove.x && move.y === setMove.y) {
      return true
    }
  }

  return false
}

module.exports = { calculateMoveSet, isMoveValid }

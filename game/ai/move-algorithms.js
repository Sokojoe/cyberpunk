'use strict'

const moveValidator = require('../validators/moveValidator')

function zombieMove (entityId, entities, room) {
  // get valid moveset
  const validMoveSet = moveValidator.calculateMoveSet(entities[entityId], room)

  // Find player coordinates
  const player = entities.find((entity) => {
    if (entity.type === 'Player') {
      return entity
    }
  })

  // Determine move that will get closest to player
  let bestMove
  let shortestDist = 10000
  for (const key in validMoveSet) {
    const potentialMove = validMoveSet[key]
    const potentialMoveCoords = { x: potentialMove.x + this.x, y: potentialMove.y + this.y }
    const dist = Math.sqrt(Math.pow((potentialMoveCoords.x - player.x), 2) + Math.pow((potentialMoveCoords.y - player.y), 2))
    if (dist < shortestDist) {
      shortestDist = dist
      bestMove = potentialMoveCoords
    }
  }

  return bestMove
}

class MoveAlgorith {
  constructor () {
    this.zombie = zombieMove
  }
}

module.exports = new MoveAlgorith()

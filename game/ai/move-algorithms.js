'use strict'

const moveValidator = require('../validators/moveValidator')
const Coordinate = require('../tiles/coordinate')

function zombieMove (entityId, entities, room) {
  // get valid moveset
  const validMoveSet = moveValidator.calculateMoveSet(entities[entityId], room)
  const entity = entities[entityId]

  // Find player coordinates
  let player
  for (const key in entities) {
    if (entities[key].type === 'Player') {
      player = entities[key]
    }
  }

  // Determine move that will get closest to player
  let bestMove
  let shortestDist = 10000
  for (const key in validMoveSet) {
    const potentialMove = validMoveSet[key]
    const potentialMoveCoords = new Coordinate(potentialMove.x + entity.position.x, potentialMove.y + entity.position.y)
    const dist = Math.sqrt(Math.pow((potentialMoveCoords.x - player.position.x), 2) + Math.pow((potentialMoveCoords.y - player.position.y), 2))
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

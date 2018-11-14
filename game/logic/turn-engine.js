'use strict'

const Coordinate = require('../tiles/coordinate')
const moveValidator = require('../validators/moveValidator')

function processMoves (room, entities, entitiesMove) {
  const newEntities = {}

  for (const entityId in entities) {
    const move = entitiesMove[entityId]
    let uniquePosition = true
    let collisionPosition
    // if the entity is moving this turn
    if (move) {
      // check that the entities desired position isn't already taken
      for (const e in newEntities) {
        if (Coordinate.isSame(move, newEntities[e].position)) {
          collisionPosition = newEntities[e].position
          uniquePosition = false
          break
        }
      }

      if (uniquePosition) {
        // If position is unique add them to the list of new entities with new position
        newEntities[entityId] = entities[entityId]
        newEntities[entityId].position = entitiesMove[entityId]
      } else {
        // Else find the second closest square to the entity which is free
        const closestCoordinate = findClosestCoordinate(room, entities[entityId].position, collisionPosition, newEntities)
        
        newEntities[entityId] = entities[entityId]
        newEntities[entityId].position = closestCoordinate
      }
    }
  }

  // re-assign the entities list
  entities = newEntities
}

function findClosestCoordinate (room, currentPosition, desiredPosition) {
  // Note, its possible none of these squares are available. Possibly might have to go for an interative approach
  const moveSet = [
    new Coordinate(0, 1),
    new Coordinate(0, -1),
    new Coordinate(1, 0),
    new Coordinate(-1, 0)
  ]

  // Mock entity to find valid squares surrounding desired position
  const entity = { position: desiredPosition, moveSet: moveSet }
  const validMoveSet = moveValidator.calculateMoveSet(entity, room)
  console.log(validMoveSet)
  let bestMove
  let shortestDist = 10000
  for (const key in validMoveSet) {
    const potentialMove = validMoveSet[key]
    const potentialMoveCoords = new Coordinate(potentialMove.x + desiredPosition.x, potentialMove.y + desiredPosition.y)
    const dist = Math.sqrt(Math.pow((potentialMoveCoords.x - currentPosition.x), 2) + Math.pow((potentialMoveCoords.y - currentPosition.y), 2))
    if (dist < shortestDist) {
      shortestDist = dist
      bestMove = potentialMoveCoords
    }
  }
  return bestMove
}

module.exports = processMoves

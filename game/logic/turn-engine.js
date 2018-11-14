'use strict'

const Coordinate = require('../tiles/coordinate')

function processMoves (room, entities, entitiesMove) {
  const newEntities = {}

  for (const entityId in entities) {
    const move = entitiesMove[entityId]
    let uniquePosition = true
    // if the entity is moving this turn
    if (move) {
      // check that the entities desired position isn't already taken
      for (const e in newEntities) {
        if (Coordinate.isSame(move, newEntities[e].position)) {
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
        // TODO: fix this
        newEntities[entityId] = entities[entityId]
        newEntities[entityId].position = new Coordinate(1, 1)
      }
    }
  }

  // re-assign the entities list
  entities = newEntities
}

module.exports = processMoves

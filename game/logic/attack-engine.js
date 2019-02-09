'use strict'

const Coordinate = require('../tiles/coordinate')

/**
 * This function proccesses all of the attacks for a given room. It should be called after entities have already been moved.
 * It will deal the damage to entities been hit, and return an object which represents the results of all the attacks taken that turn.
 */
function processAttacks (room, entities, entityAttacks) {
  return entityAttacks.map(attempt => {
    return {
      // Calculate if the attack hits anything
      targets: calculateAttack(attempt, entities),
      attack: attempt.attack,
      attacker: attempt.attacker
    }
  })
}

function calculateAttack (attempt, entities) {
  const targets = []
  for (const key in entities) {
    const entity = entities[key]
    const relativeLocation = Coordinate.addCoodinates(attempt.attacker.position, attempt.attack)
    attempt.attack.attackPattern.forEach((square) => {
      const targetLocation = Coordinate.addCoodinates(square, relativeLocation)
      if (Coordinate.isSame(entity.position, targetLocation)) {
        const damage = attempt.attacker.getWeaponDamage()
        entity.health -= damage
        console.log(`Attack hit ${entity.name} for ${damage}. ${entity.name} now has ${entity.health}/${entity.maxHealth} left!`)
        targets.push({
          target: entity,
          damage: damage,
          location: targetLocation
        })
      }
    })
  }
  return targets
}

module.exports = processAttacks

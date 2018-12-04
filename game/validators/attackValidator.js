'use strict'

const yamlParser = require('js-yaml')
const fs = require('fs')
const Coordinate = require('../tiles/coordinate')

const weapons = yamlParser.safeLoad(fs.readFileSync('./game/weapons/weapons.yml', 'utf8')).Weapons

function calculateValidAttackSet (entity, map) {
  let validAttackSet = []
  const weapon = weapons[entity.weapon]
  const attackSet = weapon.attackSet
  for (const key in attackSet) {
    if (isAttackValid(entity, map, attackSet[key])) {
      const validAttackPattern = calculateValidAttackPattern(entity, map, attackSet[key])
      validAttackSet.push({ x: attackSet[key].x, y: attackSet[key].y, attackPattern: validAttackPattern })
    }
  }
  return validAttackSet
}

function isAttackValid (entity, map, attack) {
  const attackCoordinates = new Coordinate(entity.position.x + attack.x, entity.position.y + attack.y)
  // Check if square is outside map bounds
  if (!squareInMap(attackCoordinates, map)) {
    return false
  }
  // Check if attack hits more then 0 squares
  const validAttackPattern = calculateValidAttackPattern(entity, map, attack)
  if (validAttackPattern.length < 1) {
    return false
  }

  // Check if attack exists in attack set
  const weapon = weapons[entity.weapon]
  const attackSet = weapon.attackSet

  for (const key in attackSet) {
    const setAttack = attackSet[key]
    if (Coordinate.isSame(setAttack, attack)) {
      return true
    }
  }
  return false
}

function calculateValidAttackPattern (entity, map, attack) {
  const validAttackPattern = []
  for (const key in attack.attackPattern) {
    const attackSquare = new Coordinate(entity.position.x + attack.x + attack.attackPattern[key].x,
      entity.position.y + attack.y + attack.attackPattern[key].y)
    if (squareInMap(attackSquare, map)) {
      validAttackPattern.push(attack.attackPattern[key])
    }
  }
  return validAttackPattern
}

function squareInMap (coordinate, map) {
  // Check if square is outside map bounds
  if (coordinate.x < 0 || coordinate.x >= map.width) {
    return false
  } else if (coordinate.y < 0 || coordinate.y >= map.height) {
    return false
  }
  console.log(coordinate)
  return true
}

module.exports = { calculateValidAttackSet, isAttackValid }

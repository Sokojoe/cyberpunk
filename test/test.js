const test = require('ava')
const moveValidator = require('../game/validators/moveValidator')
const attackValidator = require('../game/validators/attackValidator')
const moveAlgorith = require('../game/ai/move-algorithms')
const Player = require('../game/entitys/player')
const Zombie = require('../game/entitys/zombie')
const Coordinate = require('../game/tiles/coordinate')
const turnEngine = require('../game/logic/turn-engine')

test('fileName-functionName-exampleTest', t => {
  const a = 1
  t.is(a, 1)
})

// Testing moveValidator
test('moveValidator-isMoveValid-allowedMove', t => {
  const player = new Player('Player', new Coordinate(0, 0))
  const room = { height: 10, width: 10 }

  const moveValid = moveValidator.isMoveValid(player, room, new Coordinate(0, 1))

  t.is(moveValid, true)
})

test('moveValidator-isMoveValid-moveNotInMoveSet', t => {
  const player = new Player('Player', new Coordinate(0, 0))
  const room = { height: 10, width: 10 }

  const moveValid = moveValidator.isMoveValid(player, room, new Coordinate(0, 3))

  t.is(moveValid, false)
})

test('moveValidator-isMoveValid-moveOutOfBounds', t => {
  const player = new Player('Player', new Coordinate(0, 0))
  const room = { height: 10, width: 10 }

  const moveValid = moveValidator.isMoveValid(player, room, new Coordinate(-1, 0))

  t.is(moveValid, false)
})

test('moveValidator-calculateMoveSet', t => {
  const player = new Player('Player', new Coordinate(9, 9))
  const room = { height: 10, width: 10 }

  const moveSet = moveValidator.calculateMoveSet(player, room)

  const resultMoveSet = [
    new Coordinate(0, -2),
    new Coordinate(0, -1),
    new Coordinate(-1, -1),
    new Coordinate(-1, 0),
    new Coordinate(-2, 0)]

  t.deepEqual(moveSet, resultMoveSet)
})

test('moveAlgorith-zombieMove-StraightMovement', t => {
  const player = new Player('Player', new Coordinate(5, 5))
  const zombie = new Zombie('ZombieGuy', new Coordinate(0, 5))
  const room = { height: 10, width: 10 }
  const entities = {}
  entities[player.id] = player
  entities[zombie.id] = zombie

  const moveChoice = moveAlgorith['zombie'](zombie.id, entities, room)

  t.deepEqual(moveChoice, new Coordinate(1, 5))
})

test('moveAlgorith-zombieMove-DiagonalMovement', t => {
  const player = new Player('Player', new Coordinate(6, 6))
  const zombie = new Zombie('ZombieGuy', new Coordinate(8, 8))
  const room = { height: 10, width: 10 }
  const entities = {}
  entities[player.id] = player
  entities[zombie.id] = zombie

  const moveChoice = moveAlgorith['zombie'](zombie.id, entities, room)

  t.deepEqual(moveChoice, new Coordinate(7, 7))
})

test('moveAlgorith-zombieMove-NavigateToPlayer', t => {
  const player = new Player('Player', new Coordinate(6, 6))
  const zombie = new Zombie('ZombieGuy', new Coordinate(8, 9))
  const room = { height: 10, width: 10 }
  const entities = {}
  entities[player.id] = player
  entities[zombie.id] = zombie

  for (let i = 0; i < 3; i++) {
    const moveChoice = moveAlgorith['zombie'](zombie.id, entities, room)
    zombie.position.x = moveChoice.x
    zombie.position.y = moveChoice.y
  }

  t.is(zombie.position.x, 6)
  t.is(zombie.position.y, 6)
})

// Testing turn-engine
test('turnEngine-processMoves-noCollision', t => {
  const room = { width: 10, height: 10 }
  const entity1 = { position: new Coordinate(3, 3) }
  const entity2 = { position: new Coordinate(3, 5) }
  const entitiesMove = { '1': new Coordinate(4, 3), '2': new Coordinate(4, 5) }
  const entities = { '1': entity1, '2': entity2 }
  turnEngine(room, entities, entitiesMove)
  t.deepEqual(entities['1'].position, new Coordinate(4, 3))
  t.deepEqual(entities['2'].position, new Coordinate(4, 5))
})

test('turnEngine-processMoves-withCollision', t => {
  const room = { width: 10, height: 10 }
  const entity1 = { position: new Coordinate(3, 3) }
  const entity2 = { position: new Coordinate(3, 5) }
  const entitiesMove = { '1': new Coordinate(3, 4), '2': new Coordinate(3, 4) }
  const entities = { '1': entity1, '2': entity2 }
  turnEngine(room, entities, entitiesMove)
  t.deepEqual(entities['1'].position, new Coordinate(3, 4))
  t.deepEqual(entities['2'].position, new Coordinate(3, 5))
})

// Testing Coordinate
test('coordinate-isSame-same', t => {
  const a = new Coordinate(0, 0)
  const b = new Coordinate(0, 0)
  t.is(Coordinate.isSame(a, b), true)
})

test('coordinate-isSame-different', t => {
  const a = new Coordinate(0, 1)
  const b = new Coordinate(0, 0)
  t.is(Coordinate.isSame(a, b), false)
})

test('attackValidator-calculateValidAttackSet-allInMap', t => {
  const player = new Player('Player', new Coordinate(5, 0))
  const room = { width: 10, height: 10 }
  player.weapon = 'TestWeapon1'
  const validAttackSet = attackValidator.calculateValidAttackSet(player, room)
  const weaponAttackSet = [{
    x: 0,
    y: 5,
    attackPattern: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ] }]
  t.deepEqual(validAttackSet, weaponAttackSet)
})

test('attackValidator-calculateValidAttackSet-baseNotInMap', t => {
  const player = new Player('Player', new Coordinate(0, 10))
  const room = { width: 10, height: 10 }
  player.weapon = 'TestWeapon1'
  const validAttackSet = attackValidator.calculateValidAttackSet(player, room)
  const weaponAttackSet = []
  t.deepEqual(validAttackSet, weaponAttackSet)
})

test('attackValidator-calculateValidAttackSet-patternPartiallyInMap', t => {
  const player = new Player('Player', new Coordinate(0, 4))
  const room = { width: 10, height: 10 }
  player.weapon = 'TestWeapon1'
  const validAttackSet = attackValidator.calculateValidAttackSet(player, room)
  const weaponAttackSet = [{
    x: 0,
    y: 5,
    attackPattern: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 }
    ] }]
  t.deepEqual(validAttackSet, weaponAttackSet)
})

test('attackValidator-calculateValidAttackSet-noPattern', t => {
  const player = new Player('Player', new Coordinate(9, 0))
  const room = { width: 10, height: 10 }
  player.weapon = 'TestWeapon2'
  const validAttackSet = attackValidator.calculateValidAttackSet(player, room)
  const weaponAttackSet = []
  t.deepEqual(validAttackSet, weaponAttackSet)
})

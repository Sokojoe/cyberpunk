import test from 'ava'
import moveValidator from '../game/validators/moveValidator'
import moveAlgorith from '../game/ai/move-algorithms'
import Player from '../game/entitys/player'
import Zombie from '../game/entitys/zombie'
import Coordinate from '../game/tiles/coordinate'

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

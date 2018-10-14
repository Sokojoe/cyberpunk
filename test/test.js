import test from 'ava'
import moveValidator from '../game/validators/moveValidator'
import moveAlgorith from '../game/ai/move-algorithms'
import Player from '../game/entitys/player'
import Zombie from '../game/entitys/zombie'

// Testing moveValidator
test('moveValidator-isMoveValid-allowedMove', t => {
  const player = new Player('Player', 0, 0)
  const room = { height: 10, width: 10 }

  const moveValid = moveValidator.isMoveValid(player, room, { x: 0, y: 1 })

  t.is(moveValid, true)
})

test('moveValidator-isMoveValid-moveNotInMoveSet', t => {
  const player = new Player('Player', 0, 0)
  const room = { height: 10, width: 10 }

  const moveValid = moveValidator.isMoveValid(player, room, { x: 2, y: 0 })

  t.is(moveValid, false)
})

test('moveValidator-isMoveValid-moveOutOfBounds', t => {
  const player = new Player('Player', 0, 0)
  const room = { height: 10, width: 10 }

  const moveValid = moveValidator.isMoveValid(player, room, { x: -1, y: 0 })

  t.is(moveValid, false)
})

test('moveValidator-calculateMoveSet', t => {
  const player = new Player('Player', 9, 9)
  const room = { height: 10, width: 10 }

  const moveSet = moveValidator.calculateMoveSet(player, room)

  t.deepEqual(moveSet, [{ x: -1, y: 0 }, { x: 0, y: -1 }])
})

test('moveAlgorith-zombieMove-StraightMovement', t => {
  const player = new Player('Player', 5, 5)
  const zombie = new Zombie('ZombieGuy', 0, 5)
  const room = { height: 10, width: 10 }
  const entities = {}
  entities[player.id] = player
  entities[zombie.id] = zombie

  const moveChoice = moveAlgorith['zombie'](zombie.id, entities, room)

  t.deepEqual(moveChoice, { x: 1, y: 5 })
})

test('moveAlgorith-zombieMove-DiagonalMovement', t => {
  const player = new Player('Player', 5, 5)
  const zombie = new Zombie('ZombieGuy', 8, 8)
  const room = { height: 10, width: 10 }
  const entities = {}
  entities[player.id] = player
  entities[zombie.id] = zombie

  const moveChoice = moveAlgorith['zombie'](zombie.id, entities, room)

  t.deepEqual(moveChoice, { x: 7, y: 7 })
})

test('moveAlgorith-zombieMove-NavigateToPlayer', t => {
  const player = new Player('Player', 5, 5)
  const zombie = new Zombie('ZombieGuy', 7, 9)
  const room = { height: 10, width: 10 }
  const entities = {}
  entities[player.id] = player
  entities[zombie.id] = zombie

  for (let i = 0; i < 3; i++){
    const moveChoice = moveAlgorith['zombie'](zombie.id, entities, room)
    zombie.x = moveChoice.x
    zombie.y = moveChoice.y
  }

  t.is(zombie.x, 5)
  t.is(zombie.y, 6)
})

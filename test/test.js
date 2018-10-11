import test from 'ava'
import moveValidator from '../game/validators/moveValidator'
import Player from '../game/entitys/player'

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

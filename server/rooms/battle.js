const { Room } = require('colyseus')
const rooms = require('../../game/rooms/rooms')
const AuthController = require('../authentication')
const Player = require('../../game/entitys/player')
const Zombie = require('../../game/entitys/zombie')
const Coordinate = require('../../game/tiles/coordinate')
const moveValidator = require('../../game/validators/moveValidator')
const attackValidator = require('../../game/validators/attackValidator')
const moveAlgorith = require('../../game/ai/move-algorithms')
const turnEngine = require('../../game/logic/turn-engine')

const turnTimeout = 15

class BattleRoom extends Room {
  onAuth (options, test) {
    return new Promise((resolve, reject) => {
      AuthController.tokenValid(options.authtoken).then((decoded) => {
        resolve(decoded)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  onInit () {
    console.log('Battle Room initiated')
    this.sessions = {}
    this.timeOut = Math.floor(Date.now() / 1000) + turnTimeout
    setTimeout(() => this.executeTurn(), turnTimeout * 1000)
    console.log(this.timeOut)
    this.setState({
      entities: {},
      map: rooms['startRoom']
    })

    const zombie1 = new Zombie('Fred', new Coordinate(3, 9))
    const zombie2 = new Zombie('Sam', new Coordinate(6, 9))
    this.state.entities[zombie1.id] = zombie1
    this.state.entities[zombie2.id] = zombie2
  }

  onJoin (client, options) {
    const player = new Player(client.auth.username, new Coordinate(0, 0))
    this.sessions[client.auth.username] = {
      ready: false,
      clientId: client.id,
      entityId: player.id,
      turnSet: null
    }
    this.send(client, { turnSet: calculateTurnSet(player, this.state.map) })
    this.state.entities[player.id] = player
    console.log(client.auth.username + ' has connected')
  }

  onLeave (client) {
    const entityId = this.sessions[client.auth.username].entityId
    delete this.sessions[client.auth.username]
    delete this.state.entities[entityId]
    console.log(client.id + ' has left')
  }

  onMessage (client, data) {
    console.log(data)
    if (data.turnSet) {
      this.sessions[client.auth.username].turnSet = data.turnSet
      this.sessions[client.auth.username].ready = true
      if (allPlayersReady(this.sessions)) {
        this.executeTurn()
      }
    }
  }

  onDispose () {
    clearTimeout(this.timerFunc)
  }

  executeTurn () {
    clearTimeout(this.timerFunc)
    const currTime = Math.floor(Date.now() / 1000)
    this.timeOut = currTime + turnTimeout
    console.log(this.sessions)
    // Move all entities
    const turnSet = {}
    const entityDesiredMoves = {}
    for (const key in this.state.entities) {
      const entity = this.state.entities[key]
      if (entity.type !== 'Player') {
        entityDesiredMoves[entity.id] = moveAlgorith[entity.moveAlgorith](
          entity.id,
          this.state.entities,
          this.state.map
        )
      } else {
        entityDesiredMoves[entity.id] = entity.position
        if (this.sessions[entity.name].turnSet) {
          if (this.sessions[entity.name].turnSet.move) {
            entityDesiredMoves[entity.id] = entity.position.apply(this.sessions[entity.name].turnSet.move)
          }
        }
      }
    }
    turnEngine(this.state.map, this.state.entities, entityDesiredMoves)
    for (const key in this.state.entities) {
      const entity = this.state.entities[key]
      turnSet[key] = {
        position: entity.position,
        name: entity.name,
        type: entity.type,
        id: entity.id
      }
    }

    // Send all players the turnSet
    this.broadcast({ newTurn: turnSet })

    // Send players updated moveSets
    for (const key in this.clients) {
      const client = this.clients[key]
      const player = this.state.entities[this.sessions[client.auth.username].entityId]
      this.send(client, { turnSet: calculateTurnSet(player, this.state.map) })
    }

    // Set all sessions for next round
    for (const key in this.sessions) {
      this.sessions[key].ready = false
      this.sessions[key].turnSet = null
    }
    this.timerFunc = setTimeout(() => this.executeTurn(), (turnTimeout * 1000))
  }
}

function allPlayersReady (sessions) {
  for (const key in sessions) {
    const session = sessions[key]
    if (!session.ready) {
      return false
    }
  }
  return true
}

function calculateTurnSet (entity, map) {
  const turnSet = {}
  turnSet.validMoves = moveValidator.calculateMoveSet(entity, map)
  turnSet.validAttacks = attackValidator.calculateValidAttackSet(entity, map)
  turnSet.position = entity.position
  return turnSet
}

module.exports = BattleRoom

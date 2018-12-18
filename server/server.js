const express = require('express')
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')
const database = require('./database')
const colyseus = require('colyseus')
const colyseusMonitor = require('@colyseus/monitor').monitor
const battleRoom = require('./rooms/battle')
const moveValidator = require('../game/validators/moveValidator')
const attackValidator = require('../game/validators/attackValidator')
const moveAlgorith = require('../game/ai/move-algorithms')
const turnEngine = require('../game/logic/turn-engine')
const Coordinate = require('../game/tiles/coordinate')
const AuthController = require('./authentication')
const PORT = 6930

const app = express()
const server = http.createServer(app)

app.use('/api/auth', AuthController.router)
app.use('/static', express.static(path.join(__dirname, '../static')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const gameServer = new colyseus.Server({
  server: server
})

gameServer.register('battle', battleRoom)

app.use('/colyseus', colyseusMonitor(gameServer))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../static/index.html'))
})

app.get('/instance', AuthController.verifyToken, (req, res) => {
  database.getInstance(req.username).then((instance) => {
    delete instance['_id']

    // Find player id
    for (const key in instance.entities) {
      if (instance.entities[key].name === req.username) {
        this.playerId = instance.entities[key].id
      }
    }

    // Calculate players valid move set
    const player = instance.entities[this.playerId]
    const validMoveSet = moveValidator.calculateMoveSet(player, instance.room)
    instance.entities[this.playerId].moveSet = validMoveSet

    // Calculate players valid attack set
    const validAttack = attackValidator.calculateValidAttackSet(player, instance.room)
    instance.entities[this.playerId].attackSet = validAttack
    res.send(instance)
  })
})

app.post('/instance', AuthController.verifyToken, (req, res) => {
  database.getInstance(req.username).then((instance) => {
    // Find player id
    let playerId = null
    for (const key in instance.entities) {
      if (instance.entities[key].name === req.username) {
        playerId = instance.entities[key].id
      }
    }
    const playerRequestedCoordinates = req.body.move
    const player = instance.entities[playerId]

    const move = new Coordinate(playerRequestedCoordinates.x + player.position.x, playerRequestedCoordinates.y + player.position.y)
    const moveValid = moveValidator.isMoveValid(player, instance.room, req.body.move)

    if (moveValid) {
      const entityDesiredMoves = {}

      for (const key in instance.entities) {
        const entity = instance.entities[key]

        if (entity.type !== 'Player') {
          entityDesiredMoves[entity.id] = moveAlgorith[entity.moveAlgorith](entity.id, instance.entities, instance.room)
        }
      }

      entityDesiredMoves[playerId] = move
      turnEngine(instance.room, instance.entities, entityDesiredMoves)

      database.updateInstance(req.username, instance)

      // Build turn set
      const turnSet = {}

      for (const entityKey in instance.entities) {
        const entity = instance.entities[entityKey]
        turnSet[entityKey] = { position: entity.position,
          name: entity.name,
          type: entity.type,
          id: entity.id }
        if (entityKey === playerId) {
          // Calculate players valid move set
          const validMoveSet = moveValidator.calculateMoveSet(player, instance.room)
          turnSet[entityKey].validMoves = validMoveSet
          // Calculate players valid attack set
          const validAttackSet = attackValidator.calculateValidAttackSet(player, instance.room)
          turnSet[entityKey].validAttacks = validAttackSet
        }
      }

      res.send(turnSet)
    } else {
      res.status(400).send({ auth: false, message: 'Move is invalid' })
    }
  })
})

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`)
})

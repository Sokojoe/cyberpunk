const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const database = require('./database')
const moveValidator = require('../game/validators/moveValidator')
const moveAlgorith = require('../game/ai/move-algorithms')
const turnEngine = require('../game/logic/turn-engine')
const Coordinate = require('../game/tiles/coordinate')
const PORT = 6930

const AuthController = require('./authentication')
app.use('/api/auth', AuthController.router)
app.use('/static', express.static(path.join(__dirname, '../static')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

    const move = new Coordinate(playerRequestedCoordinates.x - player.position.x, playerRequestedCoordinates.y - player.position.y)
    const moveValid = moveValidator.isMoveValid(player, instance.room, move)

    if (moveValid) {
      const entityDesiredMoves = {}

      for (const key in instance.entities) {
        const entity = instance.entities[key]

        if (entity.type !== 'Player') {
          entityDesiredMoves[entity.id] = moveAlgorith[entity.moveAlgorith](entity.id, instance.entities, instance.room)
        }
      }
      entityDesiredMoves[playerId] = new Coordinate(playerRequestedCoordinates.x, playerRequestedCoordinates.y)
      turnEngine(instance.room, instance.entities, entityDesiredMoves)

      database.updateInstance(req.username, instance)

      // Calculate players valid move set
      const validMoveSet = moveValidator.calculateMoveSet(player, instance.room)
      instance.entities[playerId].moveSet = validMoveSet

      res.send(instance)
    } else {
      res.status(400).send({ auth: false, message: 'Move is invalid' })
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`)
})

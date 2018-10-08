const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const database = require('./database')
const moveValidator = require('../game/validators/moveValidator')
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

    // Calculate players valid move set
    const player = instance.entities[req.username]
    const validMoveSet = moveValidator.calculateMoveSet(player, instance.room)
    instance.entities[req.username].moveSet = validMoveSet

    res.send(instance)
  })
})

app.post('/instance', AuthController.verifyToken, (req, res) => {
  database.getInstance(req.username).then((instance) => {
    const playerRequestedCoordinates = req.body.move
    const player = instance.entities[req.username]

    // Validate player move is allowed
    const move = { 'x': playerRequestedCoordinates.x - player.x, 'y': playerRequestedCoordinates.y - player.y }
    const moveValid = moveValidator.isMoveValid(player, instance.room, move)

    if (moveValid) {
      player.x = playerRequestedCoordinates.x
      player.y = playerRequestedCoordinates.y
      database.updateInstance(req.username, instance)

      // Calculate players valid move set
      const validMoveSet = moveValidator.calculateMoveSet(player, instance.room)
      instance.entities[req.username].moveSet = validMoveSet

      res.send(instance)
    } else {
      res.status(400).send({ auth: false, message: 'Move is invalid' })
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`)
})

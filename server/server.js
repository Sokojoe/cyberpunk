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
    const validMoveSet = moveValidator(player, instance.room)
    instance.entities[req.username].moveSet = validMoveSet

    res.send(instance)
  })
})

app.post('/instance', AuthController.verifyToken, (req, res) => {
  database.getInstance(req.username).then((instance) => {
    const playerCoordinates = req.body.move
    instance.entities[req.username].x = playerCoordinates.x
    instance.entities[req.username].y = playerCoordinates.y
    database.updateInstance(req.username, instance)

    // Calculate players valid move set
    const player = instance.entities[req.username]
    const validMoveSet = moveValidator(player, instance.room)
    instance.entities[req.username].moveSet = validMoveSet

    res.send(instance)
  })
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`)
})

const express = require('express')
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')
const colyseus = require('colyseus')
const colyseusMonitor = require('@colyseus/monitor').monitor
const battleRoom = require('./rooms/battle')
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

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`)
})

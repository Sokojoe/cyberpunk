const express = require('express')
const path = require('path')
const database = require('./database')
const bodyParser = require('body-parser')
const app = express()
const PORT = 8080

app.use('/static', express.static(path.join(__dirname, '../static')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../static/index.html'))
})

app.post('/account', (req, res) => {
  const username = req.body.username
  database.addPlayer(username)
  res.send(`Account with username ${username} has been created.`)
})

app.get('/account', (req, res) => {
  const players = database.getPlayers()
  res.send(players)
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`)
})

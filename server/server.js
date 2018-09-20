const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const database = require('./database')
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
    res.send(instance)
  })
})

app.get('/onlyAuthorized', AuthController.verifyToken, (req, res) => {
  res.send('Authorization working!')
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`)
})

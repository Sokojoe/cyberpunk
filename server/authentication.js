const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const database = require('./database')

const SECRET = process.env.CYBER_SECRET

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/register', function (req, res) {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8)

  database.getAccount(req.body.username).then(account => {
    if (account) {
      return res.status(403).send('username already exists')
    }

    database.addAccount(req.body.username, hashedPassword)

    // create a token
    const token = jwt.sign({ username: req.body.username }, SECRET, {
      expiresIn: 86400 // expires in 24 hours
    })

    res.status(200).send({ auth: true, token: token })
  }).catch(err => {
    console.error(err)
  })
})

router.post('/login', function (req, res) {
  database.getAccount(req.body.username).then(player => {
    if (!player) {
      return res.status(404).send('No user found.')
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, player.password)

    if (!passwordIsValid) {
      return res.status(401).send('Unauthorized, password invalid.')
    }

    const token = jwt.sign({ username: req.body.username }, SECRET, {
      expiresIn: 86400 // expires in 24 hours
    })

    res.status(200).send({ auth: true, token: token })
  })
})

function verifyToken (req, res, next) {
  const token = req.headers['authtoken']
  if (!token) { return res.status(403).send({ auth: false, message: 'No token provided.' }) }

  tokenValid(token).then((decoded) => {
    req.username = decoded.username
    next()
  }).catch(() => {
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' })
  })
}

function tokenValid (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        reject(err)
      }
      resolve(decoded)
    })
  })
}

module.exports = { router, verifyToken, tokenValid }

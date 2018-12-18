const { Room } = require('colyseus')
// const rooms = require('../../game/rooms/rooms')
const AuthController = require('../authentication')
// const AuthController = require('./authentication')

class Lobby extends Room {
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
    console.log('Lobby initiated')
    this.sessions = {}
    this.setState({})
  }

  onJoin (client, options) {
    console.log(client.auth)
    console.log(client.id + ' has connected')
  }

  onLeave (client) {
    console.log(client.id + ' has left')
  }
}

module.exports = Lobby

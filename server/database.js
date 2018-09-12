// Note this is a temporary mock database, will eventually switch this out with a real database

class Database {
  constructor () {
    this.data = { 'players': {} }
    this.data.players = {}
  }

  addPlayer (username, password) {
    this.data.players[username] = { 'username': username, 'password': password }
  }

  getPlayer (username) {
    return this.data.players[username]
  }
}

module.exports = new Database()

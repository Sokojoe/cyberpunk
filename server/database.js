// Note this is a temporary mock database, will eventually switch this out with a real database

class Database {
  constructor () {
    this.data = { 'players': {} }
    this.data.players = {}
  }

  addPlayer (username) {
    this.data.players[username] = { 'username': username }
  }

  getPlayers () {
    return this.data.players
  }
}

module.exports = new Database()

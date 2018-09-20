const MongoClient = require('mongodb').MongoClient

const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cyber1-l7ckw.mongodb.net`

const dbName = 'cyberpunk'

const rooms = require('../game/rooms/rooms')

class Database {
  constructor () {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
      if (err) {
        console.log('Error connecting to MongoDB.')
        return
      }
      console.log('Connected to MongoDB!')
      this.db = client.db(dbName)
    })
  }

  addAccount (username, password) {
    const collection = this.db.collection('accounts')
    collection.insertOne({ 'username': username, 'password': password })

    this.setInstance(username, rooms['startRoom'])
  }

  getAccount (username) {
    const collection = this.db.collection('accounts')
    return collection.findOne({ 'username': username })
  }

  setInstance (username, room) {
    const instance = {
      'username': username,
      'room': room
    }

    const collection = this.db.collection('instances')
    collection.updateOne({ 'username': username }, { $set: instance }, { upsert: true })
  }

  getInstance (username) {
    const collection = this.db.collection('instances')
    return collection.findOne({ 'username': username })
  }
}

module.exports = new Database()

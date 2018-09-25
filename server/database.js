const MongoClient = require('mongodb').MongoClient

const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cyber1-l7ckw.mongodb.net`

const dbName = 'cyberpunk'

const rooms = require('../game/rooms/rooms')
const Player = require('../game/entitys/player')

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

    this.createInstance(username, rooms['startRoom'])
      .catch(err => console.error(err))
  }

  getAccount (username) {
    const collection = this.db.collection('accounts')
    return collection.findOne({ 'username': username })
      .catch(err => console.error(err))
  }

  createInstance (username, room) {
    const entities = {}
    entities[username] = new Player(username, 0, 0)
    const instance = {
      'username': username,
      'room': room,
      'entities': entities
    }

    const collection = this.db.collection('instances')
    collection.updateOne({ 'username': username }, { $set: instance }, { upsert: true })
      .catch(err => console.error(err))
  }

  updateInstance (username, instance) {
    const collection = this.db.collection('instances')
    collection.updateOne({ 'username': username }, { $set: instance }, { upsert: true })
      .catch(err => console.error(err))
  }

  getInstance (username) {
    const collection = this.db.collection('instances')
    return collection.findOne({ 'username': username })
      .catch(err => console.error(err))
  }
}

module.exports = new Database()

const MongoClient = require('mongodb').MongoClient

const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cyber1-l7ckw.mongodb.net`

const dbName = 'cyberpunk'

const rooms = require('../game/rooms/rooms')
const Player = require('../game/entitys/player')
const Zombie = require('../game/entitys/zombie')
const Coordinate = require('../game/tiles/Coordinate')

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
  }

  getAccount (username) {
    const collection = this.db.collection('accounts')
    return collection.findOne({ 'username': username })
      .catch(err => {
        console.error(err)
      })
  }

  createInstance (username, room) {
    const zombie = new Zombie('zombie', new Coordinate(9, 9))
    const player = new Player(username, new Coordinate(0, 0))
    const entities = {}
    entities[player.id] = player
    entities[zombie.id] = zombie
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

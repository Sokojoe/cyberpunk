// Note this is a temporary mock database, will eventually switch this out with a real database

const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://localhost:27017'

const dbName = 'cyberpunk'

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
  }

  getAccount (username) {
    const collection = this.db.collection('accounts')
    return collection.findOne({ 'username': username })
  }
}

module.exports = new Database()

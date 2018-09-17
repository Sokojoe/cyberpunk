'use strict'

const Tiles = require('./tiles')
const Tile = require('./tile')

class tileDictionary {
  constructor () {
    this.tiles = {}
    for (let tile of Tiles) {
      this.tiles[tile.name] = new Tile(tile.name, tile.spriteName)
    }
  }
}

module.exports = tileDictionary

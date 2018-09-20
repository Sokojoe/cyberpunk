'use strict'

const Tiles = require('./tiles')
const Tile = require('./tile')

class TileDictionary {
  constructor () {
    this.tiles = {}
    for (let tile of Tiles) {
      this.tiles[tile.name] = new Tile(tile.name, tile.spriteName)
    }
  }

  getTile (tileName) {
    return this.tiles[tileName]
  }
}

module.exports = new TileDictionary()

'use strict'

const tileDictionary = require('../tiles/tile-dictionary')

const rooms = {
  startRoom: {
    name: 'startRoom',
    width: 10,
    height: 10,
    baseTile: tileDictionary.getTile('floor'),
    specialTiles: []
  }
}

module.exports = rooms

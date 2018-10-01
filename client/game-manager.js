'use strict'

import axios from 'axios'

class GameManager {
  constructor (view) {
    this.view = view
  }

  loadGame (authtoken) {
    this.authtoken = authtoken

    const url = window.location + 'instance'
    axios.get(url, { headers: { 'authtoken': authtoken } })
      .then(res => {
        this.username = res.data.username

        const mapHeight = res.data.room.height
        const mapWidth = res.data.room.width
        const baseTile = res.data.room.baseTile
        this.view.renderMap(mapWidth, mapHeight, baseTile, (coordinates) => { this.setMoveCoordinates(coordinates) })

        this.view.createPlayer()
        this.loadEntities(res.data.entities)
      })
  }

  loadEntities (entities) {
    const username = this.username
    const playerX = entities[username].x
    const playerY = entities[username].y
    this.view.playerMoveSet = entities[username].moveSet
    this.view.setPlayerLocation({ x: playerX, y: playerY })
  }

  setMoveCoordinates (coordinates) {
    console.log(coordinates)
    this.move = coordinates
    this.sendTurn()
  }

  sendTurn () {
    const url = window.location + 'instance'
    axios.post(url, { move: this.move }, { headers: { 'authtoken': this.authtoken } })
      .then((res) => {
        this.loadEntities(res.data.entities)
      })
  }
}

module.exports = GameManager

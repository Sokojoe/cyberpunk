'use strict'

import axios from 'axios'

class GameManager {
  constructor (view) {
    this.view = view
  }

  loadGame (authtoken, username) {
    this.authtoken = authtoken
    const url = window.location + 'instance'
    axios.get(url, { headers: { 'authtoken': authtoken } })
      .then(res => {
        const mapHeight = res.data.room.height
        const mapWidth = res.data.room.width
        const baseTile = res.data.room.baseTile
        this.view.renderMap(mapWidth, mapHeight, baseTile)

        this.username = res.data.username
        const username = this.username
        const playerX = res.data.entities[username].x
        const playerY = res.data.entities[username].y
        this.view.createPlayer(playerX, playerY)
      })
      .catch(err => console.error(err))
  }
}

module.exports = GameManager

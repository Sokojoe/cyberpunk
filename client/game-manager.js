'use strict'

import axios from 'axios'

class GameManager {
  constructor (view) {
    this.view = view
    this.uiManager = {}
    this.playerId = null
  }

  loadGame (authtoken) {
    this.authtoken = authtoken

    const url = window.location + 'instance'
    axios.get(url, { headers: { 'authtoken': authtoken } })
      .then(res => {
        this.username = res.data.username

        // Find player id
        for (const key in res.data.entities) {
          if (res.data.entities[key].name === this.username) {
            this.playerId = res.data.entities[key].id
          }
        }

        this.view.renderRoom(res.data.room)
        this.view.renderEntities(res.data.entities)
        this.uiManager.moveButton = this.view.renderMoveButton(this.uiManager)
        this.uiManager.endTurnButton = this.view.renderEndTurnButton(this.uiManager, () => this.sendTurn())
        this.uiManager.moveButton.setActive(res.data.entities[this.playerId].moveSet)
        this.uiManager.endTurnButton.setUnActive()
      })
  }

  sendTurn () {
    const move = { move: this.uiManager.moveButton.playerMove }
    const url = window.location + 'instance'
    axios.post(url, move, { headers: { 'authtoken': this.authtoken } })
      .then((res) => {
        this.view.renderEntitiesTurn(res.data)
        this.uiManager.moveButton.setActive(res.data[this.playerId].validMoves)
        this.uiManager.endTurnButton.setUnActive()
      })
  }
}

module.exports = GameManager

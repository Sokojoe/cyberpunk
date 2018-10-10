'use strict'

import axios from 'axios'

class GameManager {
  constructor (view) {
    this.view = view
    this.uiManager = {}
  }

  loadGame (authtoken) {
    this.authtoken = authtoken

    const url = window.location + 'instance'
    axios.get(url, { headers: { 'authtoken': authtoken } })
      .then(res => {
        this.username = res.data.username
        this.view.renderRoom(res.data.room)
        this.view.renderEntities(res.data.entities, res.data.username)
        this.uiManager.moveButton = this.view.renderMoveButton(this.uiManager)
        this.uiManager.endTurnButton = this.view.renderEndTurnButton(this.uiManager, () => this.sendTurn())
        this.uiManager.moveButton.setActive(res.data.entities[res.data.username].moveSet)
        this.uiManager.endTurnButton.setUnActive()
      })
  }

  sendTurn () {
    const move = { move: this.uiManager.moveButton.playerMove }
    const url = window.location + 'instance'
    axios.post(url, move, { headers: { 'authtoken': this.authtoken } })
      .then((res) => {
        this.view.renderEntities(res.data.entities, res.data.username)
        this.uiManager.moveButton.setActive(res.data.entities[res.data.username].moveSet)
        this.uiManager.endTurnButton.setUnActive()
      })
  }
}

module.exports = GameManager

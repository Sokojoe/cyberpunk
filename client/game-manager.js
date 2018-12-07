'use strict'

import axios from 'axios'
import weaponFile from '../game/weapons/weapons.yml'
import UiManager from './ui/uiManager'

console.log(weaponFile.Weapons)

class GameManager {
  constructor (view) {
    this.view = view
    this.uiManager = {}
    this.playerId = null
    this.uiState = {}
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

        this.uiState.moveSet = res.data.entities[this.playerId].moveSet
        this.uiState.attackSet = res.data.entities[this.playerId].attackSet
        this.uiState.position = res.data.entities[this.playerId].position

        this.view.renderRoom(res.data.room)
        this.view.renderEntities(res.data.entities)
        this.uiManager = new UiManager(this.view.app.stage, this.uiState, (turnSet) => this.sendTurn(turnSet))
      })
  }

  sendTurn (turnSet) {
    const url = window.location + 'instance'
    axios.post(url, turnSet, { headers: { 'authtoken': this.authtoken } })
      .then((res) => {
        console.log(res)
        this.view.renderEntitiesTurn(res.data)
        this.uiState = res.data
      })
  }
}

module.exports = GameManager

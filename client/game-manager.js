'use strict'

import UiManager from './ui/uiManager'
import * as Colyseus from 'colyseus.js'

class GameManager {
  constructor (view) {
    this.view = view
    this.uiManager = {}
    this.playerId = null
    this.uiState = {}
  }

  loadGame (authtoken) {
    this.authtoken = authtoken

    let client = new Colyseus.Client(`ws://${window.location.host}`)
    const room = client.join('battle', { authtoken: authtoken })
    this.uiManager = new UiManager(this.view.app.stage, this.uiState, (turnSet) => sendTurn(turnSet))

    room.listen(':new', (change) => {
      if (change.operation === 'add') {
        if (change.path.new === 'map') {
          this.view.renderRoom(change.value)
        }
      }
    })

    room.listen('entities/:entity', (change) => {
      if (change.operation === 'add') {
        if (checkIfEntityPlayer(window.localStorage.getItem('username'), change.value)) {
          this.playerId = change.value.id
        }
        this.view.renderEntity(change.value)
      }
    })

    room.onMessage.add((change) => {
      if (change.turnInfo) {
        this.uiState.player = change.turnInfo.player
        this.uiState.map = change.turnInfo.map
        this.uiManager.reset()
      }
      if (change.newTurn) {
        for (const key in change.newTurn) {
          const entity = change.newTurn[key]
          this.view.renderEntityTurn(entity)
        }
      }
    })

    const sendTurn = (turnSet) => {
      room.send({ turnSet: turnSet })
    }
  }
}

function checkIfEntityPlayer (username, entity) {
  if (entity.name === username) {
    return username
  }
  return null
}

module.exports = GameManager

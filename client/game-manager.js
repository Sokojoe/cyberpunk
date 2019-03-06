'use strict'

import UiManager from './pixi-ui/uiManager'
import * as Colyseus from 'colyseus.js'

class GameManager {
  constructor (view) {
    this.view = view
    this.uiManager = {}
    this.playerId = null
    this.uiState = {}
    this.room = {}
  }

  loadGame (authtoken) {
    this.authtoken = authtoken

    let client = new Colyseus.Client(`ws://${window.location.host}`)
    this.room = client.join('battle', { authtoken: authtoken })
    this.uiManager = new UiManager(this.view.app.stage, this.uiState, (turnSet) => sendTurn(turnSet))

    this.room.listen(':new', (change) => {
      if (change.operation === 'add') {
        if (change.path.new === 'map') {
          this.view.renderRoom(change.value)
        }
      }
    })

    this.room.listen('entities/:entity', (change) => {
      if (change.operation === 'add') {
        if (checkIfEntityPlayer(window.localStorage.getItem('username'), change.value)) {
          this.playerId = change.value.id
        }
        this.view.renderEntity(change.value)
      }
    })

    this.room.onMessage.add((change) => {
      if (change.turnInfo) {
        this.uiState.player = change.turnInfo.player
        this.uiState.map = change.turnInfo.map
        if (change.turnInfo.join) {
          this.uiManager.reset()
        }
      }
      if (change.newTurn) {
        const events = change.newTurn
        this.uiManager.hide()
        events.reduce((promiseChain, currentTask) => {
          return promiseChain.then(chainResults => {
            if (currentTask.turn === 'move') {
              return this.view.renderEntityTurn(currentTask).then(currentResult =>
                [ ...chainResults, currentResult ]
              )
            } else if (currentTask.turn === 'action') {
              return this.view.renderEntityAction(currentTask).then(currentResult =>
                [ ...chainResults, currentResult ]
              )
            }
          })
        }, Promise.resolve([])).then(() => {
          this.uiManager.reset()
        })
      }
    })

    const sendTurn = (turnSet) => {
      this.room.send({ turnSet: turnSet })
    }
  }

  disconnect () {
    this.room.leave()
  }
}

function checkIfEntityPlayer (username, entity) {
  if (entity.name === username) {
    return username
  }
  return null
}

module.exports = GameManager

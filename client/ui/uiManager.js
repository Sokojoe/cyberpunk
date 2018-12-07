'use strict'

import AttackButton from './attackButton'
import MoveButton from './moveButton'
import EndTurnButton from './endTurnButton'

class uiManager {
  constructor (stage, playerState, endTurn) {
    this.turnSet = {}
    this.buttons = [
      { status: 'current', button: new MoveButton(stage, this, playerState, this.turnSet) },
      { status: 'ready', button: new AttackButton(stage, this, playerState, this.turnSet) }
    ]
    this.endTurnButton = new EndTurnButton(stage, this, this.turnSet, endTurn)
    this.reset()
  }

  update () {
    for (const key in this.buttons) {
      const button = this.buttons[key]
      if (button.status === 'current') {
        button.button.setActive()
      } else {
        button.button.setUnActive()
      }
    }
    this.setEndTurn()
  }

  setEndTurn () {
    let endTurnEnabled = true
    for (const key in this.buttons) {
      const button = this.buttons[key]
      if (button.status !== 'done') {
        endTurnEnabled = false
        break
      }
    }
    if (endTurnEnabled) {
      this.endTurnButton.setActive()
    } else {
      this.endTurnButton.setUnActive()
    }
  }

  setNextActive () {
    for (const key in this.buttons) {
      const button = this.buttons[key]
      if (button.status === 'current') {
        button.status = 'done'
      } else if (button.status === 'ready') {
        button.status = 'current'
      }
    }
    this.update()
  }

  setThisActive (b) {
    for (const key in this.buttons) {
      const button = this.buttons[key]
      if (button.button === b) {
        button.status = 'current'
      } else if (button.status === 'current') {
        button.status = 'ready'
      }
    }
    this.update()
  }

  reset () {
    for (const key in this.buttons) {
      const button = this.buttons[key]
      button.status = 'ready'
    }
    this.buttons[0].status = 'current'
    this.update()
  }
}

module.exports = uiManager

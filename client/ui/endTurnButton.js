'use strict'

import Button from './button'

class EndTurnButton extends Button {
  constructor (stage, uiManager, turnSet, sendTurn) {
    super(stage, 'EndTurn', { x: 4, y: 10 })
    this.turnSet = turnSet
    this.uiManager = uiManager
    this.sendTurn = sendTurn
    this.onClick(() => {
      sendTurn(turnSet)
      uiManager.reset()
    })
  }

  setActive () {
    super.setUnActive(() => {

    })
  }

  setUnActive () {
    super.setActive(() => {

    })
  }
}

module.exports = EndTurnButton

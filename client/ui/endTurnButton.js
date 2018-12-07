'use strict'

import Button from './button'

class EndTurnButton extends Button {
  constructor (stage, uiManager, turnSet, sendTurn) {
    super(stage, 'EndTurn', { x: 4, y: 10 }, { activeColor: 0x1b13f9, inactiveColor: 0x66ff14 })
    this.turnSet = turnSet
    this.uiManager = uiManager
    this.sendTurn = sendTurn
    this.onClick(() => {
      sendTurn(turnSet)
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

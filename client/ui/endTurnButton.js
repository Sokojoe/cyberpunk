'use strict'

import Button from './button'

const END_TURN_TEXT = 'End Turn'
const PENDING_TEXT = 'Pending...'

class EndTurnButton extends Button {
  constructor (stage, uiManager, turnSet, sendTurn) {
    super(stage, END_TURN_TEXT, { x: 4, y: 10 }, { activeColor: 0x1b13f9, inactiveColor: 0x66ff14 })
    this.turnSet = turnSet
    this.uiManager = uiManager
    this.sendTurn = sendTurn
    this.onClick(() => {
      this.setText(PENDING_TEXT)
      sendTurn(turnSet)
    })
  }

  setActive () {
    super.setUnActive(() => {

    })
  }

  setUnActive () {
    this.setText(END_TURN_TEXT)
    super.setActive(() => {

    })
  }
}

module.exports = EndTurnButton

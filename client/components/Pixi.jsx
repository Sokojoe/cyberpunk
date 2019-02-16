import React from 'react'

import View from '../pixi'
import GameManager from '../game-manager'

class Pixi extends React.Component {
  componentDidMount () {
    this.pixi = new View()
    this.app = this.pixi.app
    this.gameManager = new GameManager(this.pixi)
    this.gameManager.loadGame(window.localStorage.getItem('authKey'))
    this.gameCanvas.appendChild(this.app.view)
  }

  render () {
    let component = this
    return (
      <div className='view' ref={(thisDiv) => { component.gameCanvas = thisDiv }} />
    )
  }
}

export default Pixi

import React from 'react'

import LoginBar from './LoginBar'
import Pixi from './Pixi.jsx'

class App extends React.Component {
  constructor () {
    super()

    this.state = {
      authenticated: false
    }
  }

  render () {
    let game = null
    if (this.state.authenticated) {
      game = <Pixi />
    }
    return (
      <div>
        <LoginBar login={() => this.setState({ authenticated: true })} logout={() => this.setState({ authenticated: false })} />
        {game}
      </div>
    )
  }
}

export default App

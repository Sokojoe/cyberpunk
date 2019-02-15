import React from 'react'

import LoginBar from './LoginBar'
import LogoutBar from './LogoutBar'
import Pixi from './Pixi.jsx'
import axios from 'axios'

class App extends React.Component {
  constructor () {
    super()

    this.state = {
      authenticated: false
    }

    this.isAuthenticated()
  }

  render () {
    if (this.state.authenticated === true) {
      return (
        <div>
          <LogoutBar logout={() => this.isAuthenticated()} />
          <Pixi />
        </div>
      )
    } else {
      return (
        <div>
          <LoginBar login={() => this.isAuthenticated()} />
        </div>
      )
    } 
  }

  isAuthenticated () {
    const token = window.localStorage.getItem('authKey')
    if (!token) this.setState({ authenticated: false })
    else {
      const url = window.location.origin + window.location.pathname + 'api/auth/authenticated'
      axios.get(url, { headers: { authtoken: token } }).then((res) => {
        this.setState({ authenticated: true })
      }).catch(() => {
        this.setState({ authenticated: false })
      })
    }
  }
}

export default App

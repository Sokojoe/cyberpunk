'use strict'

import axios from 'axios'

class GameManager {
  constructor (view) {
    this.view = view
  }

  loadGame (authtoken) {
    this.authtoken = authtoken
    const url = window.location + 'instance'
    axios.get(url, { headers: { 'authtoken': authtoken } })
      .then(res => console.log(res.data))
      .catch(err => console.log(err))
  }
}

module.exports = GameManager

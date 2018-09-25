import loginManager from './login.js'
import GameManager from './game-manager'
import View from './pixi'

const view = new View()
const gameManager = new GameManager(view)
loginManager.initializePage(gameManager)

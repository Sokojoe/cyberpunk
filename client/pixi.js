import * as PIXI from 'pixi.js'

function initializePixi(){
  const app = new PIXI.Application();
  const canvasLocation = document.getElementById("pixiCanvas")
  canvasLocation.appendChild(app.view)
}

module.exports = { initializePixi }

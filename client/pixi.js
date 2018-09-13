import * as PIXI from 'pixi.js'
import tile from './resources/sprites/floor.png'

function initializePixi () {
  const app = new PIXI.Application()
  const canvasLocation = document.getElementById('pixiCanvas')

  let container = new PIXI.Container()

  for (let x = 0; x < 640; x += 32) {
    for (let y = 0; y < 480; y += 32) {
      let floorTile = PIXI.Sprite.fromImage(tile)
      floorTile.x = x
      floorTile.y = y
      container.addChild(floorTile)
    }
  }

  app.stage.addChild(container)

  canvasLocation.appendChild(app.view)
}

module.exports = { initializePixi }

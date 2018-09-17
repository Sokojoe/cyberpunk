import * as PIXI from 'pixi.js'
import tile from './resources/sprites/floor.png'
import player from './resources/sprites/Player.png'

function onTileClick(tile, Player){
  console.log(tile.coordinates);
  movePlayer(Player, tile.coordinates)
}

function movePlayer(Player, coordinates) {
  Player.x = coordinates.x * 32
  Player.y = coordinates.y * 32
}

function initializePixi () {
  const app = new PIXI.Application()
  const canvasLocation = document.getElementById('pixiCanvas')

  let Player = PIXI.Sprite.fromImage(player)
  let container = new PIXI.Container()

  for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 15; y++) {
      let floorTile = PIXI.Sprite.fromImage(tile)
      floorTile.x = x * 32
      floorTile.y = y * 32
      floorTile.coordinates = {'x': x, 'y': y}
      floorTile.interactive = true
      floorTile.buttonMode = true
      floorTile.on('pointerdown', ()=>{onTileClick(floorTile, Player)})
      container.addChild(floorTile)
    }
  }
  app.stage.addChild(container)
  app.stage.addChild(Player)

  canvasLocation.appendChild(app.view)
}

module.exports = { initializePixi }

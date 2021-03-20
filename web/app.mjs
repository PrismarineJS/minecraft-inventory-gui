import { getImage } from '../web/util.mjs'
import { CanvasEventManager } from '../lib/CanvasManager.mjs'
import { PlayerWin } from '../lib/inventories'

window.canvas = document.getElementById('demo')
var canvasManager = new CanvasEventManager(canvas)
canvasManager.setScale(3.5)

window.inventory = new PlayerWin(canvasManager, {
    getImage
})

setTimeout(() => {
  canvasManager.startRendering()
  console.log('Rendering!')
}, 1400)
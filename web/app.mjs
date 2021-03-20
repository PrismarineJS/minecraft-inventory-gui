import { getImage } from '../web/util.mjs'
import { CanvasEventManager } from '../lib/CanvasManager.mjs'
import * as InventoryWindows from '../lib/inventories.mjs'

window.canvas = document.getElementById('demo')
var canvasManager = new CanvasEventManager(canvas)
canvasManager.setScale(3.5)

window.inventory = new InventoryWindows.PlayerWin(canvasManager, {
    getImage
})

setTimeout(() => {
  canvasManager.startRendering()
  console.log('Rendering!')
}, 2000)

window.updateWin = () => {
  canvasManager.reset()
  const selWindow = document.getElementById('active-win').value
  window.inventory = new InventoryWindows[selWindow](canvasManager, { getImage })
  canvasManager.slideInUp(window.inventory)
  window.inventory.needsUpdate = true
}
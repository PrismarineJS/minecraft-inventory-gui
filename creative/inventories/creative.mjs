import { getImage } from '../util.mjs'
import '../layouts.mjs'

class BB {
  constructor(minX, minY, dx, dy, xoff = 0, yoff = 0) {
    this.minX = minX + xoff
    this.minY = minY + yoff
    this.maxX = this.minX + dx
    this.maxY = this.minY + dy
    this.contains = (x, y) => x > this.minX && y > this.minY && x < this.maxX && y < this.maxY
    this.bbRel = [this.minX, this.minY, dx, dy]
    this.bbAbs = [this.minX, this.minY, this.maxX, this.maxY]
  }
}

class CanvasEventManager {
  lastCursorPosition = { x: 0, y: 0 }
  needsInputUpdate = false

  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.children = []
    this.ctx.imageSmoothingEnabled = false;//derp
    canvas.onmousemove = this.onCursorMove
    canvas.onmousedown = this.onCursorClick
    canvas.onmouseup = this.onCursorRelease
    canvas.tabIndex = 1 // Allow us to capture key presses
    canvas.style.outline = "none" // remove the outline
    canvas.addEventListener('keydown', this.onKeyDown, { passive: true })
  }

  setScale(scale) {
    this.ctx.scale(scale, scale)
  }

  // Translates cursor page position to canvas relative position
  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect()
    return {
      x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
      y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    }
  }

  // Translates canvas DOM position to context scaled position
  getCanvasCoords(ctx, screenX, screenY) {
    let matrix = ctx.getTransform();
    var imatrix = matrix.invertSelf();
    let x = screenX * imatrix.a + screenY * imatrix.c + imatrix.e;
    let y = screenX * imatrix.b + screenY * imatrix.d + imatrix.f;
    return { x, y }
  }

  onCursorMove = (evt) => {
    const pos = this.getMousePos(this.canvas, evt)
    this.lastCursorPosition = this.getCanvasCoords(this.ctx, pos.x, pos.y)
    this.needsInputUpdate = true
  }

  onCursorClick = (evt) => {
    const pos = this.getMousePos(canvas, evt);
    const { x, y } = this.getCanvasCoords(this.ctx, pos.x, pos.y)
    this.children.forEach(e => e.onCanvasMouseDown(x, y))
  }

  onCursorRelease = (evt) => {
    const pos = this.getMousePos(canvas, evt);
    const { x, y } = this.getCanvasCoords(this.ctx, pos.x, pos.y)
    this.children.forEach(e => e.onCanvasMouseUp(x, y))
  }

  onKeyDown = (evt) => {
    // console.log('Got key down', evt)
    this.children.forEach(e => e.onCanvasKeyDown(evt.key, evt.code))
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.index = 0
  }

  startRendering() {
    const loop = () => {
      for (const child of this.children) {
        child.render()
      }

      setTimeout(() => requestAnimationFrame(loop), 40)
    }
    requestAnimationFrame(loop)
  }
}

class CanvasWindow {
  scale = 1

  drawItem(obj, x, y) {
    const items = ['item/brick',
      'block/brain_coral',
      'item/redstone',
      'block/powered_rail_on',
      'block/bookshelf',
      'item/apple',
      'item/compass_00']
    const path = items[Math.floor(Math.random() * items.length)];
    // const path = ''
    this.drawImage({ path }, x, y)
    this.drawText({ value: Math.floor(Math.random() * 100), stroke: true, fontStyle: 'bold', px: 8, style: 'white' }, x + 10, y + 16)
  }

  drawImage(obj, dx, dy, slice, scale) {
    dx ||= 0; dy ||= 0;
    dx *= this.scale
    dy *= this.scale
    const img = getImage(obj)
    scale = scale || 1
    if (slice) {
      const w = slice[2]; const h = slice[3]
      // sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
      // console.log(img, arguments, slice[0], slice[1], slice[2], slice[3], dx, dy, w * scale, h * scale)
      this.drawCtx.drawImage(img, slice[0], slice[1], slice[2], slice[3], dx, dy, w * scale, h * scale)
    } else {
      this.drawCtx.drawImage(img, dx, dy)
    }

    // console.log('draw image', obj, dx, dy)
  }

  drawText(obj, x, y) {
    x ||= 0; y ||= 0;
    x *= this.scale
    y *= this.scale
    this.drawCtx.font = `${obj.fontStyle || 'normal'} ${obj.fontVariant || 'normal'} ${obj.fontWeight || 'normal'} ${obj.px || 11}px sans-serif`
    this.drawCtx.fillStyle = obj.style || 'black'
    this.drawCtx.fillText(obj.value, x, y)
    if (obj.stroke) {
      this.drawCtx.lineWidth = 0.4
      this.drawCtx.strokeText(obj.value, x, y)
      this.drawCtx.lineWidth = 1
    }
    // console.log('drawText', obj, x, y)
  }

  drawBox(aroundBB) {
    this.drawCtx.fillStyle = "#000000";
    // console.log('box',aroundBB)
    this.drawCtx.strokeRect(...aroundBB)
  }

  drawInput(obj, [x, y, mx], text) {
    this.drawCtx.fillStyle = "#FFFFFF"
    // this.drawBox(obj.bb)
    // this.drawCtx.strokeRect(...obj.bb)
    const measured = this.drawCtx.measureText(text)
    // console.log('Measured', measured)
    let lPadding = obj.horizontalPadding ?? 2
    let rPadding = obj.horizontalPadding ?? 4
    const fontHeight = measured.fontBoundingBoxAscent + measured.fontBoundingBoxDescent
    // lPadding = obj.width / mx
    this.drawCtx.fillText(text, x + lPadding, fontHeight + y, mx - rPadding)
  }
}

class InventoryWindow extends CanvasWindow {
  floatingItem
  activeInput

  needsUpdate = true
  sensitiveRegions = new Map()
  boxHighlights = []
  downListeners = []
  downScrollbar

  constructor(canMan) {
    super()
    canMan.children.push(this)
    this.can = canMan
    this.drawCtx = canMan.ctx
  }

  onCanvasMouseDown(x, y) {
    this.activeInput = null

    for (const [bb, id, type, handler, data] of this.sensitiveRegions.values()) {
      if (bb.contains(x, y) && type.includes('click')) {
        console.log('click in', bb)
        // hits.push(bb.bbRel)
        handler(id, 'click', [x, y], data)
        this.downListeners.push([handler, id])
      }
    }
  }

  onCanvasMouseUp() {
    this.downListeners.forEach(([handler, id]) => handler(id, 'release', [this.can.lastCursorPosition.x, this.can.lastCursorPosition.y]))
    this.downListeners = []
  }

  $(elementId) {
    return this['$' + elementId]
  }

  onCanvasKeyDown(key, code) {
    if (this.activeInput && this.$(this.activeInput)) {
      const varId = this.$(this.activeInput).variable
      if (key.length == 1) { // detect character, better way to do this?
        this[varId] += key
      } else if (code == 'Backspace') {
        this[varId] = this[varId].slice(0, -1)
      } else if (code == 'Escape') {
        this.activeInput = null
        return
      }
      this.onInputBoxInteract(this.activeInput, 'press', [])
      this.needsUpdate = true
    }
  }

  registerSensitive(regionBB, type, id, handler, data) {
    this.sensitiveRegions.set(type + regionBB.bbRel.toString(), [regionBB, id, type, handler, data])
  }

  updateCursorHighlights() {
    const { x, y } = this.can.lastCursorPosition
    this.boxHighlights = []
    const hits = []
    for (const [bb, id, type, handler, data] of this.sensitiveRegions.values()) {
      if (bb.contains(x, y) && type.includes('hover')) {
        // console.log('in',bb)
        hits.push(bb.bbRel)
        handler(id, 'hover', [x, y], data)
      }
    }
    // this.tickRender()
    for (const hit of hits) {
      this.boxHighlights.push(hit)
    }
  }

  render() {
    if (this.can.needsInputUpdate) {
      this.updateCursorHighlights()
      this.can.needsInputUpdate = false
      this.needsUpdate = true
    }

    if (this.needsUpdate) {
      this.sensitiveRegions.clear()
      this.can.clear()
      this.renderLayout(this.layout)
      this.renderOverlays()
      // console.log('drew')
      this.needsUpdate = false
    }
  }

  renderOverlays() {
    for (const box of this.boxHighlights) {
      this.drawBox(box)
    }

    if (this.floatingItem) {
      const { x, y } = this.can.lastCursorPosition
      this.drawItem(null, x - 8, y - 8)
    }

    this.drawCtx.fillText(`Pos: x: ${this.can.lastCursorPosition.x} y: ${this.can.lastCursorPosition.y}`, 0, 10)
  }

  index = 0

  renderLayout(obj, xoff = 0, yoff = 0) {
    // console.log('rl', xoff, yoff)
    for (const key in obj) {
      const val = obj[key]
      if (!val.id) val.id = this.index++
      this['$' + val.id] = val
      let _with = val.with
      if (val.using) {
        Object.assign(this, val.using)
      }
      val.x ??= 0
      val.y ??= 0
      if (_with) {
        if (val.with instanceof Function) {
          _with = val.with(this, val)
        }
        if (_with.includes('.')) {
          const [key, entry] = _with.split('.')
          Object.assign(val, globalThis.layouts[key].using?.[entry])
        } else {
          // console.log('assign', val, this.windows[this.windowId].using[_with])
          Object.assign(val, globalThis.layouts[this.windowId].using[_with])
        }
      }
      if (val['if']) {
        const ctx = this;
        if (val['if'] instanceof Function) {
          if (val['if'](ctx, val) != true) continue
          // console.log('val', val, val['if'](), 'is true')
        } else if (eval(val['if']) != true) {
          continue
          // console.log('val',val,val.if,eval(val['if']),'is true')
        }
      }

      if (val.draw) {
        val.draw(this, val, [ val.x + xoff, val.y + yoff ])
      } else if (val.type == 'image') {
        this.drawImage(val, val.x + xoff, val.y + yoff, val.slice, val.scale)
      } else if (val.type == 'input') {
        // TODO
        const bb = [...val.bb]
        bb[0] += xoff
        bb[1] += yoff
        this.registerSensitive(new BB(...bb), 'hover+click', val.id, this.onInputBoxInteract)
        this.drawInput(val, bb, this[val.variable])
      } else if (val.type == 'text') {
        this.drawText(val, val.x + xoff, val.y + yoff)
      } else if (val.type == 'container') {
        // console.log('RC',val.x + xoff, val.y + yoff)
        this.renderLayout(val.children, val.x + xoff, val.y + yoff)
      } else if (val.type == 'itemgrid') {
        var i = 0;
        val.size ??= 16
        val.padding ??= 2
        for (var _x = 0; _x < val.width; _x++) {
          for (var _y = 0; _y < val.height; _y++) {
            const bb = [val.x + (_x * val.size) + xoff + (_x * val.padding), val.y + (_y * val.size) + yoff + (_y * val.padding), val.size, val.size]
            // this.drawBox(bb)
            this.drawItem(this[val.containing][i], bb[0], bb[1])
            // console.log('d', bb)
            this.registerSensitive(new BB(...bb), 'hover+click', val.id, this.onItemEvent)
            i++;
          }
        }
      } else if (val.type == 'scrollbar') {
        // console.log('registered', ...val.bb, xoff, yoff)
        const bb = new BB(...val.bb, xoff, yoff)
        // this.drawBox(bb.bbRel)
        this.registerSensitive(bb, 'hover+click', val.id, this.onScrollbarEvent, [bb, val])
        const inc = this[val.id + 'Increment']

        if (inc) {
          this.drawImage(val, val.x + xoff, val.y + yoff + inc.y, val.slice, val.scale)
        } else {
          this.drawImage(val, val.x + xoff, val.y + yoff, val.slice, val.scale)
        }
      } else if (val.type == 'box') {
        this.drawBox([ val.x + xoff, val.y + yoff, val.h ?? 10, val.w ?? 10 ])
      }

      if (val.tip) {
        console.assert(val.slice, 'need a slice bb for sensitive region', val)

        const bb = [val.x + xoff, val.y + yoff, val.slice[2], val.slice[3]]
        // this.drawBox(bb)
        this.registerSensitive(new BB(...bb), 'hover', val.id, this.onTooltipEvent)
      }
      if (val.onClick) {
        const bb = [val.x, val.y, val.h ?? val.slice[2], val.w ?? val.slice[3]]
        this.registerSensitive(new BB(...bb), 'click', val.id, this.onClickEvent)
      }
      // console.log('REC')
      if (val.children && val.type != 'container') {
        // console.log(val)
        this.renderLayout(val.children, xoff, yoff)
      }
    }
  }

  onInputBoxInteract = (id, type, pos) => {
    console.log('input box interact', id, type, pos)
    if (type == 'click') {
      this.activeInput = id
    }
  }

  onItemEvent = (id, type, pos) => {

  }

  onClickEvent = (id, type, pos) => {

  }

  onTooltipEvent = (id, type, pos) => {
    console.log('called', id, type, pos)
  }

  onScrollbarEvent = (id, type, [ax, ay], data) => {
    if (type == 'release') {
      this.downScrollbar = null
    } else if (type == 'hover' && this.downScrollbar == id) {
      const [bb, val] = data
      const spHeight = val.slice[3]
      const bbHeight = val.bb[3]
      // bb.maxY - relPos.y;
      // const rX = bb.maxX - ax
      // const rY = bb.maxY - ay
      const adjustedY = ay - (spHeight / 2)
      // console.log('sensitive',[ax,ay], rY, rY / bbHeight)
      this[val.id + 'Increment'] = { x: bb.maxY - ax, y: Math.max(0, Math.min(bbHeight - spHeight, adjustedY - bb.minY)) }
    } else if (type == 'click') {
      this.downScrollbar = id
    }
  }
}

class CreativeInventory extends InventoryWindow {
  windowId = 'Creative'
  activeTab = 5

  hotbarItems = []
  bodyItems = []
  survivalItems = []

  shieldItem = []
  headItem = []
  chestItem = []
  legItem = []
  feetItem = []

  constructor(canMan, ctx) {
    super(canMan)

    // Load layout
    this.layout = [globalThis.layouts.Creative]
  }

  onClickEvent = (id, type, pos) => {
    console.log('Clicked', id, '!')
    this.activeTab = this.tabs.indexOf(id)
    this.needsUpdate = true
  }
}

class BrewingStandInventory extends InventoryWindow {
  windowId = 'BrewingStand'
  layout = [ globalThis.layouts.BrewingStand ]

  blazePowderItem = []
  ingredientItem = []
  bottleItemA = []
  bottleItemB = []
  bottleItemC = []

  inventoryItems = []
  hotbarItems = []

  brewingTicks = 20*20
  fuelRemaining = 20

  constructor(...args) {
    super(...args)

    setInterval(() => {
      this.brewingTicks--
      this.fuelRemaining--
      if (this.fuelRemaining < 0) this.fuelRemaining = 20
      this.needsUpdate = true
    }, 50)
  }
}

class AnvilInventory extends InventoryWindow {
  windowId = 'Anvil'
  layout = [ globalThis.layouts.Anvil ]

  inputItemsA = []
  inputItemsB = []
  resultItems = []
  inventoryItems = []
  hotbarItems = []

  renameText = 'Hello world!'
}

window.canvas = document.getElementById('demo')
var canvasManager = new CanvasEventManager(canvas)
canvasManager.setScale(4)
// window.creative = new CreativeInventory(canvasManager, {
//   hotbarSlots: [['minecraft:apple', 21], ['minecraft:axe', 1, { Damage: 22 }]]
// })

// window.creative = new BrewingStandInventory(canvasManager, {
//   hotbarSlots: [['minecraft:apple', 21], ['minecraft:axe', 1, { Damage: 22 }]]
// })

window.creative = new AnvilInventory(canvasManager, {
  hotbarSlots: [['minecraft:apple', 21], ['minecraft:axe', 1, { Damage: 22 }]]
})

setTimeout(() => {
  canvasManager.startRendering()
  console.log('Rendering!')
}, 1400)
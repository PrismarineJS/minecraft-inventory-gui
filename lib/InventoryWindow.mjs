import { BB, getDistance, CanvasWindow } from './CanvasWindow.mjs'
import { layouts } from './layouts.mjs'

const TESTING = globalThis.TESTING

export class InventoryWindow extends CanvasWindow {
  floatingItem
  needsUpdate = true

  _activeInput
  _sensitiveRegions = new Map()

  _boxHighlights = []
  _downListeners = []
  _downScrollbar
  _downKeys = new Set()

  _lastClick = null
  _lastHover = []

  layout = layouts[this.layoutId]

  constructor(canMan, dataProvider) {
    super()
    console.warn(this)
    canMan.children.push(this)
    this.can = canMan
    this.drawCtx = canMan.ctx

    this.getImage = dataProvider.getImage
  }

  onCanvasMouseDown(x, y, secondary) {
    this._activeInput = null
    let double = false
    if (this._lastClick) {
      const dist = getDistance(x, y, this._lastClick.x, this._lastClick.y)
      const timeDelta = Date.now() - this._lastClick.time
      if (dist < 0.5 && timeDelta < 500 && !this._lastClick.double) {
        console.log('Double click!')
        double = true
      }
    }

    for (const [bb, id, type, handler, data] of this._sensitiveRegions.values()) {
      if (bb.contains(x, y) && type.includes('click')) {
        let str = double ? 'doubleclick' : 'click'
        if (secondary) str = 'right' + str
        this[handler](id, str, [x, y], data)
        this._downListeners.push([handler, id])
      }
    }
    this._lastClick = { x, y, time: Date.now(), double }
  }

  onCanvasMouseUp() {
    this._downListeners.forEach(([handler, id]) => this[handler](id, 'release', [this.can.lastCursorPosition.x, this.can.lastCursorPosition.y]))
    this._downListeners = []
  }

  $(elementId) {
    return this['$' + elementId]
  }

  onCanvasKeyDown(key, code) {
    this._downKeys.add(code)
    if (this._activeInput && this.$(this._activeInput)) {
      const varId = this.$(this._activeInput).variable
      if (key.length == 1) { // detect character, better way to do this?
        this[varId] += key
      } else if (code == 'Backspace') {
        this[varId] = this[varId].slice(0, -1)
      } else if (code == 'Escape') {
        this._activeInput = null
        return
      }
      this.onInputBoxInteract(this._activeInput, 'press', [])
      this.needsUpdate = true
    }
  }

  onCanvasKeyUp(key, code) {
    this._downKeys.delete(code)
  }

  registerSensitive(regionBB, type, id, handler, data) {
    this._sensitiveRegions.set(type + regionBB.bbRel.toString(), [regionBB, id, type, handler, data])
  }

  isActive(id) {
    return this._lastHover.includes(id)
  }

  updateCursorHighlights() {
    const { x, y } = this.can.lastCursorPosition
    this._boxHighlights = []
    const hitBBs = []
    const hitsIds = []
    for (const [bb, id, type, handler, data] of this._sensitiveRegions.values()) {
      if (bb.contains(x, y) && type.includes('hover')) {
        hitBBs.push(bb.bbRel)
        hitsIds.push(id)
        this[handler](id, 'hover', [x, y], data)
      }
    }
    for (const hit of hitBBs) {
      this._boxHighlights.push(hit)
    }
    for (const id of this._lastHover) {
      if (!hitsIds.includes(id)) {
        this.onTooltipEvent(id, 'release')
      }
    }
    this._lastHover = hitsIds
  }

  render() {
    this.layout ??= [layouts[this.layoutId]]
    if (this.can.needsInputUpdate) {
      this.updateCursorHighlights()
      this.can.needsInputUpdate = false
      this.needsUpdate = true
    }

    if (this.needsUpdate) {
      this._sensitiveRegions.clear()
      this.can.clear()
      this.renderLayout(this.layout)
      this.renderOverlays()
      // console.log('drew',this.layout,this.layoutId,layouts)
      this.needsUpdate = false
    }
  }

  renderOverlays() {
    for (const box of this._boxHighlights) {
      this.drawBox(box)
    }

    if (this.floatingItem) {
      const { x, y } = this.can.lastCursorPosition
      this.drawItem(this.floatingItem, x - 8, y - 8)
    }

    this.drawCtx.fillText(`Pos: x: ${this.can.lastCursorPosition.x} y: ${this.can.lastCursorPosition.y}`, 0, 10)
  }

  index = 0

  renderLayout(obj, xoff = 0, yoff = 0) {
    for (const key in obj) {
      const val = obj[key]
      if (!val.id) val.id = this.index++
      this['$' + val.id] = val
      let _using = val.using
      if (val.with) {
        Object.assign(this, val.with)
      }
      val.x ??= 0
      val.y ??= 0

      // Merge values from `using` value into current object
      if (_using) {
        if (val.using instanceof Function) {
          _using = val.using(this, val)
        }
        if (_using.includes('.')) {
          const [key, entry] = _using.split('.')
          Object.assign(val, layouts[key].with?.[entry])
        } else {
          Object.assign(val, this.layout[0].with[_using])
        }
      }

      // Run `if` condition to see if we should render this or not
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
        val.draw(this, val, [val.x + xoff, val.y + yoff])
      } else if (val.type == 'image') {
        this.drawImage(val, val.x + xoff, val.y + yoff, val.slice, val.scale)
      } else if (val.type == 'input') {
        const bb = [...val.bb]
        bb[0] += xoff
        bb[1] += yoff
        this.registerSensitive(new BB(...bb), 'hover+click', val.id, 'onInputBoxInteract')
        this.drawInput(val, bb, this[val.variable])
      } else if (val.type == 'text') {
        this.drawText(val, val.x + xoff, val.y + yoff)
      } else if (val.type == 'container') {
        this.renderLayout(val.children, val.x + xoff, val.y + yoff)
      } else if (val.type == 'itemgrid') {
        let i = 0
        // Some defaults
        val.width ??= 1; val.height ??= 1; val.size ??= 16; val.margin ??= 2; val.padding ??= 0;
        for (let _x = 0; _x < val.width; _x++) {
          for (let _y = 0; _y < val.height; _y++) {
            const bb = [val.x + (_x * val.size) + xoff + (_x * val.margin) + val.padding, val.y + (_y * val.size) + yoff + (_y * val.margin) + val.padding, val.size, val.size]
            // this.drawBox(bb)
            const item = this[val.containing][i]
            if (item || TESTING) this.drawItem(item, bb[0], bb[1])
            if (val.padding) { // Apply padding to the bb
              bb[0] -= val.padding; bb[1] -= val.padding; bb[2] += val.padding * 2; bb[3] += val.padding * 2;
            }
            this.registerSensitive(new BB(...bb), 'hover+click', val.id, 'onItemEvent', [val.containing, i])
            i++
          }
        }
      } else if (val.type == 'scrollbar') {
        const bb = new BB(...val.bb, xoff, yoff)
        // this.drawBox(bb.bbRel)
        this.registerSensitive(bb, 'hover+click', val.id, 'onScrollbarEvent', [bb, val])
        const inc = this[val.id + 'Increment']

        if (inc) {
          this.drawImage(val, val.x + xoff, val.y + yoff + inc.y, val.slice, val.scale)
        } else {
          this.drawImage(val, val.x + xoff, val.y + yoff, val.slice, val.scale)
        }
      } else if (val.type == 'box') {
        this.drawBox([val.x + xoff, val.y + yoff, val.w ?? 10, val.h ?? 10])
      }

      if (val.tip) {
        const slice = val.slice ?? [0, 0, val.w, val.h]
        console.assert(slice, 'need a slice bb for sensitive region', val)

        const bb = [val.x + xoff, val.y + yoff, slice[2], slice[3]]
        // this.drawBox(bb)
        this.registerSensitive(new BB(...bb), 'hover', val.id, 'onTooltipEvent')
      }
      if (val.onClick) {
        const bb = [val.x, val.y, val.h ?? val.slice[2], val.w ?? val.slice[3]]
        this.registerSensitive(new BB(...bb), 'click', val.id, 'onClickEvent')
      }

      if (val.children && val.type != 'container') {
        this.renderLayout(val.children, xoff, yoff)
      }
    }
  }

  onInputBoxInteract(id, type, pos) {
    // console.log('input box interact', id, type, pos)
    if (type == 'click') {
      this._activeInput = id
    }
  }

  onItemEvent(id, type, pos, data) {
    this.emit('itemEvent', id, type, pos, data)
  }

  onClickEvent(id, type, pos, data) {
    this.emit('click', id, type, pos, data)
  }

  onTooltipEvent(id, type, pos, data) {
    // console.log('called', id, type, pos)
    this.emit('tooltip', id, type, pos, data)
  }

  onScrollbarEvent(id, type, [ax, ay], data) {
    if (type == 'release') {
      this._downScrollbar = null
    } else if (type == 'hover' && this._downScrollbar == id) {
      const [bb, val] = data
      const spHeight = val.slice[3]
      const bbHeight = val.bb[3]
      const adjustedY = ay - (spHeight / 2)

      this[val.id + 'Increment'] = { x: bb.maxY - ax, y: Math.max(0, Math.min(bbHeight - spHeight, adjustedY - bb.minY)) }
    } else if (type == 'click') {
      this._downScrollbar = id
    }
  }
}
if (typeof module !== 'undefined') {
  // var { createCanvas } = require('canvas')
  // var fs = require('fs')
  const { getImage } = require('./util.mjs')
  var { windows } = require('./layouts.mjs')
} else {

}

windows.icon = {

}

var maxRuns = 40;

class BB {
  constructor(minX, minY, dx, dy, xoff=0, yoff=0) {
    this.minX = minX + xoff
    this.minY = minY + yoff
    this.maxX = this.minX + dx
    this.maxY = this.minY + dy
    this.contains = (x, y) => x > this.minX && y > this.minY && x < this.maxX && y < this.maxY
    this.bbRel = [this.minX, this.minY, dx, dy]
    this.bbAbs = [this.minX, this.minY, this.maxX, this.maxY]
  }
}

class InvWindow {
  scale = 1
  windowId = 'Creative'

  constructor(ctx) {
    this.drawCtx = ctx
    this.drawCtx.font = '12px sans-serif'
    this.windows = windows

    this.sensitiveRegions = new Map()

    this.lastX = 0
    this.lastY = 0
  }

  registerSensitive(regionBB, type, id, handler) {
    this.sensitiveRegions.set(type + regionBB.bbRel.toString(), [regionBB, id, type, handler])
    // this.sensitiveRegions.set(regionBB, handler)
  }

  getCanvasCoords = function (ctx, screenX, screenY) {
    let matrix = ctx.getTransform();
    var imatrix = matrix.invertSelf();
    let x = screenX * imatrix.a + screenY * imatrix.c + imatrix.e;
    let y = screenX * imatrix.b + screenY * imatrix.d + imatrix.f;
    return [x, y];
  }

  tickCursor(evt) {
    var pos = getMousePos(canvas, evt);
    const [x, y] = this.getCanvasCoords(this.drawCtx, pos.x, pos.y)

    clearTimeout(this.int)
    this.int = setTimeout(() => {
      this.lastX = x; this.lastY = y;
      // console.log(this.sensitiveRegions)
      const hits = []
      for (const [bb, id, type, handler] of this.sensitiveRegions.values()) {
        if (bb.contains(x, y) && type.includes('hover')) {
          // console.log('in',bb)
          hits.push(bb.bbRel)
          handler(id, 'hover', [x, y])
        } else {
          // console.log('not in',x,y,bb)
        }
      }
      this.tickRender()
      for (const hit of hits) {
        this.drawBox(hit)
      }
      if (hits.length) {
        console.warn('Rendered for', hits)
      }
    }, 20)

    // this.drawCtx.fillStyle = "#000000";
    // this.drawCtx.fillRect (x, y, 4, 4)
  }

  tickClick(evt) {
    var pos = getMousePos(canvas, evt);
    const [x, y] = this.getCanvasCoords(this.drawCtx, pos.x, pos.y)
    for (const [bb, id, type, handler] of this.sensitiveRegions.values()) {
      if (bb.contains(x, y) && type.includes('click')) {
        console.log('click in',bb)
        // hits.push(bb.bbRel)
        handler(id, 'click', [x, y])
      }
    }
  }

  onClick = (id, type, pos) => {
    
  }

  onInputBoxInteract = (id, type, pos) => {

  }

  tickRender() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.index = 0
    this.render(this.renderWindow)
    this.renderOverlays()
  }

  renderOverlays() {

  }

  render(obj, xoff = 0, yoff = 0) {
    for (const key in obj) {
      // maxRuns--
      // if (maxRuns<0) throw 1;
      const val = obj[key]
      if (!val.id) val.id = this.index++
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
          Object.assign(val, this.windows[key].using?.[entry])
        } else {
          // console.log('assign', val, this.windows[this.windowId].using[_with])
          Object.assign(val, this.windows[this.windowId].using[_with])
        }
      }
      if (val['if']) {
        const ctx = this;
        if (val['if'] instanceof Function) {
          if (val['if']() != true) continue
          console.log('val',val,val['if'](),'is true')
        } else if (eval(val['if']) != true) {
          continue
          // console.log('val',val,val.if,eval(val['if']),'is true')
        }
      }

      if (val.draw) {
        val.draw(this, val)
      } else if (val.type == 'image') {
        this.drawImage(val, val.x + xoff, val.y + yoff, val.slice, val.scale)
      } else if (val.type == 'input') {
        // TODO
        this.drawInput(val)
      } else if (val.type == 'text') {
        this.drawText(val, val.x + xoff, val.y + yoff)
      } else if (val.type == 'container') {
        // console.log('RC',val.x + xoff, val.y + yoff)
        this.render(val.children, val.x + xoff, val.y + yoff)
      } else if (val.type == 'itemgrid') {
        var i = 0;
        for (var _x = 0; _x < val.width; _x++) {
          for (var _y = 0; _y < val.height; _y++) {
            const bb = [(_x * val.size) + xoff + (_x * val.padding), (_y * val.size) + yoff + (_y * val.padding), val.size, val.size]
            // this.drawBox()
            this.drawItem(this[val.containing][i], bb[0], bb[1])
            this.registerSensitive(new BB(...bb), 'hover+click', val.id, (id, type, pos) => {

            })
            i++;
          }
        }
      } else if (val.type == 'scrollbar') {
        // console.log('registered', ...val.bb, xoff, yoff)
        const bb = new BB(...val.bb, xoff, yoff)
        // this.drawBox(bb.bbRel)
        this.registerSensitive(bb, 'hover+click', val.id, (id, type, [ax,ay]) => {
          const spHeight = val.slice[3]
          const bbHeight = val.bb[3]
          // bb.maxY - relPos.y;
          const rX = bb.maxX-ax
          const rY = bb.maxY-ay
          const adjustedY = ay - (spHeight / 2)
          console.log('sensitive',[ax,ay], rY, rY / bbHeight)
          this[val.id + 'Increment'] = {x: bb.maxY-ax, y: Math.max(0,Math.min(bbHeight - spHeight, adjustedY - bb.minY)) }
        })
        const inc = this[val.id + 'Increment']

        if (inc) {
          this.drawImage(val, val.x + xoff, val.y + yoff + inc.y, val.slice, val.scale)
        } else {
          this.drawImage(val, val.x + xoff, val.y + yoff, val.slice, val.scale)
        }
      }

      if (val.tip) {
        console.assert(val.slice, 'need a slice bb for sensitive region', val)

        const bb = [val.x, val.y, val.slice[2], val.slice[3]]
        // this.drawBox(bb)

        this.registerSensitive(new BB(...bb), 'hover', val.id, (id, type, pos) => {
          console.log('called', val)
        })
      }
      if (val.onClick) {
        const bb = [val.x, val.y, val.slice[2], val.slice[3]]
        this.registerSensitive(new BB(...bb), 'click', val.id, this.onClick)
      }

      // console.log('REC')
      if (val.children && val.type != 'container') {
        // console.log(val)
        this.render(val.children, xoff, yoff)
      }
    }
  }

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
    this.drawCtx.font = `${obj.fontStyle || 'normal'} ${obj.fontVariant || 'normal'} ${obj.fontWeight||'normal'} ${obj.px || 11}px sans-serif`
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

  drawInput(obj) {
    // this.drawCtx.fillStyle = "#000000"
    // this.drawBox(obj.bb)
    // this.drawCtx.strokeRect(...obj.bb)

    this.registerSensitive(new BB(...obj.bb), 'hover+click', obj.id, this.onInputBoxInteract)
  }
}

class CreativeWindow extends InvWindow {
  name = "creative"
  activeTab = 5

  hotbar = []
  bodyItems = []

  constructor(ctx) {
    super(ctx)
    this.tabs = [
      'undefined', 'tabBuilding', 'tabDecoration', 'tabRedstone', 'tabTransport', 'tabSaved', 'tabSearch', 'tabMisc', 'tabFood', 'tabTools', 'tabCombat', 'tabBrewing', 'tabSurvival'
    ]
  }

  start() {
    if (JSON.stringify(loadedImageBlobs) == '{}') throw 1;
    this.renderWindow = [windows.Creative]
    super.render(this.renderWindow)

    // super.render()

    // this.ctx.drawImage()
    // console.log

  }

  renderOverlays() {
    this.drawItem(null, this.lastX - 8, this.lastY - 8)
  }

  onClick = (id, type, pos) => {
    console.log('Clicked', id, '!')
    this.activeTab = this.tabs.indexOf(id)
    this.tickRender()
  }
}

const canvas = document.getElementById('demo')
const ctx = canvas.getContext('2d')
globalThis.ctx = ctx
ctx.scale(4, 4)
ctx.imageSmoothingEnabled = false;//derp
const creative = new CreativeWindow(ctx)
setTimeout(() => creative.start(), 1400)

canvas.onmousemove = (evt) => {
  // console.log('mouse move', evt)
  creative.tickCursor(evt)
}

canvas.onclick = (evt) => {
  // console.log('mouse move', evt)
  creative.tickClick(evt)
}


function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
    y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
  };
}

// setInterval(() => {
//   // console.log('mouse pos', getMousePos(canvas, ))
// })
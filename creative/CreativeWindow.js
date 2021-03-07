if (typeof module !== 'undefined') {
  // var { createCanvas } = require('canvas')
  // var fs = require('fs')
  const { getImage } = require('./util')
  var {windows} = require('./windows')
} else {

}

windows.icon = {

}

var maxRuns = 40;

class BB {
  constructor(minX,minY,dx,dy) {
    this.minX = minX
    this.minY = minY
    this.maxX = minX + dx
    this.maxY = minY + dy
    this.contains = (x,y) => x > minX && y > minY && x < this.maxX && y < this.maxY
    this.bbRel = [minX,minY,dx,dy]
    this.bbAbs = [minX,minY,this.maxX,this.maxY]
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

  registerSensitive(regionBB, handler) {
    this.sensitiveRegions.set(regionBB.bbRel.toString(), [ regionBB, handler ])
    // this.sensitiveRegions.set(regionBB, handler)
  }

  getCanvasCoords = function(ctx, screenX, screenY) {
    let matrix = ctx.getTransform();
    var imatrix = matrix.invertSelf();
    let x = screenX * imatrix.a + screenY * imatrix.c + imatrix.e;
    let y = screenX * imatrix.b + screenY * imatrix.d + imatrix.f;
    return [x, y];
  }  

  tickCursor(evt) {
    var pos = getMousePos(canvas, evt);
    const [x,y] = this.getCanvasCoords(this.drawCtx, pos.x, pos.y)

    clearTimeout(this.int)
    this.int = setTimeout(() => {
      this.lastX = x; this.lastY = y;
      // console.log(this.sensitiveRegions)
      const hits = []
      for (const [bb,handler] of this.sensitiveRegions.values()) {
        if (bb.contains(x,y)) {
          hits.push(bb.bbRel)
          handler()
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.tickRender()
      for (const hit of hits) {
        this.drawBox(hit)
      }
      if (hits.length) {
        console.warn('Rendered for',hits)
      }
    }, 20)

    // this.drawCtx.fillStyle = "#000000";
    // this.drawCtx.fillRect (x, y, 4, 4)


  }

  tickRender() {
    this.render(this.renderWindow)
  }

  render(obj, xoff = 0, yoff = 0) {
    for (const key in obj) {
      // maxRuns--
      // if (maxRuns<0) throw 1;
      const val = obj[key]
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
        if (val['if'] instanceof Function) if (val['if']() != true) continue
        else if (eval(val['if']) != true) continue
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

      }

      if (val.tip) {
        console.assert(val.slice, 'need a slice bb for sensitive region', val)

        const bb = [val.x,val.y,val.slice[2],val.slice[3]]
        // this.drawBox(bb)

        this.registerSensitive(new BB(...bb), () => {
          console.log('called',val)
        })
      }

      // console.log('REC')
      if (val.children && val.type != 'container') {
        // console.log(val)
        this.render(val.children, xoff, yoff)
      }
    }
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
    this.drawCtx.font = obj.px + 'px sans-serif'
    this.drawCtx.fillText(obj.value, x, y)
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

    this.registerSensitive(new BB(...obj.bb), () => {
      console.log('Sensitive region!')
    })
  }
}

class CreativeWindow extends InvWindow {
  name = "creative"
  activeTab = 5

  constructor(ctx) {
    super(ctx)
  }

  start() {
    if (JSON.stringify(loadedImageBlobs)=='{}')throw 1;
    this.renderWindow = [windows.Creative]
    super.render(this.renderWindow)

    // super.render()

    // this.ctx.drawImage()
    // console.log

  }
}

const canvas = document.getElementById('demo')
const ctx = canvas.getContext('2d')
globalThis.ctx = ctx
ctx.scale(4,4)
ctx.imageSmoothingEnabled = false;//derp
const creative = new CreativeWindow(ctx)
setTimeout(() => creative.start(), 1400)

canvas.onmousemove = (evt) => {
  // console.log('mouse move', evt)
  creative.tickCursor(evt)
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
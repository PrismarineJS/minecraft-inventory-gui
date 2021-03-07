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

class InvWindow {
  scale = 1
  windowId = 'Creative'

  constructor(ctx) {
    this.drawCtx = ctx
    this.drawCtx.font = '12px sans-serif'
    this.windows = windows
  }

  render(obj, xoff = 0, yoff = 0) {
    for (const key in obj) {
      maxRuns--
      if (maxRuns<0) throw 1;
      const val = obj[key]
      let _with = val.with
      if (val.using) {
        Object.assign(this, val.using)
      }
      if (_with) {
        if (val.with instanceof Function) {
          _with = val.with(this, val)
        }
        if (_with.includes('.')) {
          const [key, entry] = _with.split('.')
          Object.assign(val, this.windows[key].using?.[entry])
        } else {
          console.log('assign', val, this.windows[this.windowId].using[_with])
          Object.assign(val, this.windows[this.windowId].using[_with])
        }
      }
      // if (val['if']) {
      //   if (val['if'] instanceof Function) if (val['if']() != true) continue
      //   else if (eval(val['if']) != true) continue
      // }
      if (val.draw) {
        val.draw(this, val)
      } else if (val.type == 'image') {
        this.drawImage(val, val.x + xoff, val.y + yoff, val.slice, val.scale)
      } else if (val.type == 'input') {
        // TODO
      } else if (val.type == 'text') {
        this.drawText(val, val.x + xoff, val.y + yoff)
      } else if (val.type == 'container') {
        console.log('RC',val.x + xoff, val.y + yoff)
        this.render(val.children, val.x + xoff, val.y + yoff)
      } else if (val.type == 'itemgrid') {

      }
      console.log('REC')
      if (val.children && val.type != 'container') {
        console.log(val)
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
      console.log(img, arguments, slice[0], slice[1], slice[2], slice[3], dx, dy, w * scale, h * scale)
      this.drawCtx.drawImage(img, slice[0], slice[1], slice[2], slice[3], dx, dy, w * scale, h * scale)
    } else {
      this.drawCtx.drawImage(img, dx, dy)
    }

    console.log('draw image', obj, dx, dy)
  }

  drawText(obj, x, y) {
    x ||= 0; y ||= 0;
    x *= this.scale
    y *= this.scale
    this.drawCtx.fillText(obj.value, x, y)
    console.log('drawText', obj, x, y)
  }
}

class CreativeWindow extends InvWindow {
  name = "creative"

  constructor(ctx) {
    super(ctx)
  }

  start() {
    if (JSON.stringify(loadedImageBlobs)=='{}')throw 1;
    const entry = [windows.Creative]
    super.render(entry)

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
setTimeout(() => new CreativeWindow(ctx).start(), 1400)